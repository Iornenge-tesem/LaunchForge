// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./LaunchForgeToken.sol";

/**
 * @title LaunchForgeFactory
 * @notice Deploys immutable ERC-20 tokens for LaunchForge projects.
 *
 *         Launch flow (atomic):
 *           1. Caller must have approved this factory to spend LAUNCH_FEE USDC.
 *           2. Caller calls createToken(name, symbol, supply).
 *           3. Factory transfers USDC from caller to treasury.
 *           4. Factory deploys a new LaunchForgeToken.
 *           5. Entire supply is minted to the caller.
 *
 *         If the USDC transfer fails, the entire transaction reverts —
 *         no token is created without payment.
 */
contract LaunchForgeFactory {
    using SafeERC20 for IERC20;

    /* ── State ──────────────────────────────────────────────── */

    /// @notice USDC contract on Base mainnet
    IERC20 public immutable usdc;

    /// @notice Wallet that receives launch fees
    address public immutable treasury;

    /// @notice Launch fee in USDC (6 decimals). 0.1 USDC = 100_000
    uint256 public constant LAUNCH_FEE = 100_000;

    /// @notice Max supply a creator can mint (10 billion tokens)
    uint256 public constant MAX_SUPPLY = 10_000_000_000;

    /// @notice All tokens ever deployed through this factory
    address[] public deployedTokens;

    /// @notice Tokens deployed by a specific creator
    mapping(address => address[]) public tokensByCreator;

    /* ── Events ─────────────────────────────────────────────── */

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 supply,
        string metadataURI
    );

    /* ── Constructor ────────────────────────────────────────── */

    /**
     * @param _usdc   USDC contract address (Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
     * @param _treasury Wallet that receives launch fees
     */
    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");
        usdc = IERC20(_usdc);
        treasury = _treasury;
    }

    /* ── Core ───────────────────────────────────────────────── */

    /**
     * @notice Deploy a new ERC-20 token.
     * @dev    Caller must have approved this factory for at least LAUNCH_FEE USDC.
     * @param _name   Token name  (e.g. "ForgeToken")
     * @param _symbol Token symbol (e.g. "FRG")
     * @param _supply Total supply in whole tokens (minted with 18 decimals)
     * @return token  Address of the newly deployed token contract
     */
    function createToken(
        string calldata _name,
        string calldata _symbol,
        uint256 _supply,
        string calldata _metadataURI
    ) external returns (address token) {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_symbol).length > 0, "Symbol required");
        require(_supply > 0 && _supply <= MAX_SUPPLY, "Invalid supply");
        require(bytes(_metadataURI).length > 0, "Metadata URI required");

        // 1. Collect payment — reverts if insufficient allowance/balance
        usdc.safeTransferFrom(msg.sender, treasury, LAUNCH_FEE);

        // 2. Deploy token — entire supply minted to caller
        LaunchForgeToken newToken = new LaunchForgeToken(
            _name,
            _symbol,
            _supply,
            msg.sender,
            _metadataURI
        );

        token = address(newToken);

        // 3. Track deployment
        deployedTokens.push(token);
        tokensByCreator[msg.sender].push(token);

        // 4. Emit event
        emit TokenCreated(token, msg.sender, _name, _symbol, _supply, _metadataURI);
    }

    /* ── Views ──────────────────────────────────────────────── */

    /// @notice Total number of tokens deployed through this factory
    function totalDeployed() external view returns (uint256) {
        return deployedTokens.length;
    }

    /// @notice Number of tokens a specific creator has deployed
    function creatorTokenCount(address _creator) external view returns (uint256) {
        return tokensByCreator[_creator].length;
    }
}
