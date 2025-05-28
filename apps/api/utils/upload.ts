import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getMimeType(base64: string): string {
  const match = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
  if (!match) throw new Error("Invalid base64 image string");
  return match[1];
}

export async function saveImageToSupabase(
  fileBase64: string,
  fileName: string,
): Promise<string> {
  const contentType = getMimeType(fileBase64);

  const base64Data = fileBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const { data, error: uploadError } = await supabase.storage
    .from("gallery-images")
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage
    .from("gallery-images")
    .getPublicUrl(fileName);

  if (!publicData?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return publicData.publicUrl;
}
