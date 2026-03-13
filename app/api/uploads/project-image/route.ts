import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

const BUCKET = process.env.SUPABASE_PROJECT_IMAGES_BUCKET ?? "project-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "jpg";
  return fileName.slice(dot + 1).toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing image file" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Only image uploads are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Image too large (max 5MB)" },
        { status: 400 }
      );
    }

    const ext = getExtension(file.name);
    const objectPath = `project/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabase();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

    return NextResponse.json({ ok: true, url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
