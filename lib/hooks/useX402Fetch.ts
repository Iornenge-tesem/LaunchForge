"use client";

/**
 * React hook for x402 paid fetch requests.
 *
 * Flow:
 *   1. Makes normal fetch to the API
 *   2. If 402 is returned, parses payment requirements from headers
 *   3. Signs an EIP-712 USDC payment with the user's wallet (via wagmi)
 *   4. Retries the request with the X-PAYMENT header
 *   5. Coinbase facilitator settles the USDC on-chain
 */

import { useCallback, useState } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { x402Client, x402HTTPClient } from "@x402/core/client";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
import {
  decodePaymentRequiredHeader,
  encodePaymentSignatureHeader,
} from "@x402/core/http";

const NETWORK = "eip155:8453" as const;

export type PaymentStep =
  | "idle"
  | "submitting"
  | "payment-required"
  | "signing"
  | "confirming"
  | "done"
  | "error";

/**
 * Hook that wraps fetch with x402 payment handling.
 *
 * Usage:
 *   const { paidFetch, step, error } = useX402Fetch();
 *   const res = await paidFetch("/api/projects/create", { method: "POST", body });
 */
export function useX402Fetch() {
  const [step, setStep] = useState<PaymentStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const paidFetch = useCallback(
    async (url: string, init?: RequestInit): Promise<Response> => {
      setStep("submitting");
      setError(null);

      try {
        // 1. Try the request normally
        const res = await fetch(url, init);

        // 2. If not 402, return as-is
        if (res.status !== 402) {
          setStep(res.ok ? "done" : "error");
          if (!res.ok) {
            // Clone before reading so callers can still read the body
            const cloned = res.clone();
            const body = await cloned.json().catch(() => ({}));
            setError(body.error ?? `Request failed (${res.status})`);
          }
          return res;
        }

        // 3. 402 — payment required
        setStep("payment-required");

        if (!walletClient || !publicClient) {
          throw new Error("Wallet not connected — connect your wallet to pay");
        }

        // 4. Parse payment requirements from the response header
        const paymentRequiredHeader = res.headers.get("x-payment-required");
        if (!paymentRequiredHeader) {
          throw new Error("Server returned 402 but no payment requirements");
        }
        const paymentRequired =
          decodePaymentRequiredHeader(paymentRequiredHeader);

        // 5. Create x402 client with the user's wallet as signer
        const signer = toClientEvmSigner(
          {
            address: walletClient.account.address,
            signTypedData: (args: {
              domain: Record<string, unknown>;
              types: Record<string, unknown>;
              primaryType: string;
              message: Record<string, unknown>;
            }) =>
              walletClient.signTypedData({
                account: walletClient.account,
                domain: args.domain as Parameters<
                  typeof walletClient.signTypedData
                >[0]["domain"],
                types: args.types as Parameters<
                  typeof walletClient.signTypedData
                >[0]["types"],
                primaryType: args.primaryType,
                message: args.message,
              }),
          },
          publicClient
        );

        const client = new x402Client().register(
          NETWORK,
          new ExactEvmScheme(signer)
        );
        const httpClient = new x402HTTPClient(client);

        // 6. Sign the payment
        setStep("signing");
        const paymentPayload =
          await httpClient.createPaymentPayload(paymentRequired);
        const paymentHeaders =
          httpClient.encodePaymentSignatureHeader(paymentPayload);

        // 7. Retry with payment header
        setStep("confirming");
        const paidRes = await fetch(url, {
          ...init,
          headers: {
            ...Object.fromEntries(
              new Headers(init?.headers).entries()
            ),
            ...paymentHeaders,
          },
        });

        if (!paidRes.ok) {
          const body = await paidRes.json().catch(() => ({}));
          throw new Error(
            body.error ?? `Payment accepted but request failed (${paidRes.status})`
          );
        }

        setStep("done");
        return paidRes;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Payment failed";
        setError(msg);
        setStep("error");
        throw err;
      }
    },
    [walletClient, publicClient]
  );

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
  }, []);

  return { paidFetch, step, error, reset };
}
