import { type NextRequest } from "next/server";
import sharp from "sharp";
import { parseCarImageParams, ParamError } from "@/lib/params";
import { buildBlobKey, getCachedImage, cacheImage } from "@/lib/blob-cache";
import { generateCarImage } from "@/lib/generate-car-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function imageResponse(buffer: Buffer) {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400",
      "Vercel-CDN-Cache-Control": "public, max-age=31536000",
      "Content-Disposition": "inline",
    },
  });
}

async function resizeIfNeeded(
  buffer: Buffer,
  width: number | null,
  height: number | null
): Promise<Buffer> {
  if (!width && !height) return buffer;
  return sharp(buffer)
    .resize(width ?? undefined, height ?? undefined, { fit: "inside" })
    .png()
    .toBuffer();
}

export async function GET(request: NextRequest) {
  try {
    // 1. Validate params
    const params = parseCarImageParams(request.nextUrl.searchParams);
    const { view, brand, model, year, color, width, height } = params;

    // 2. Build blob key (always for the full 1024x1024 source)
    const key = buildBlobKey(view, brand, model, year, color!);

    // 3. Check blob cache
    let fullImage: Buffer | null = null;
    try {
      fullImage = await getCachedImage(key);
    } catch {
      // Blob read failed — fall through to generation
    }

    // 4. Generate with OpenAI if not cached
    if (!fullImage) {
      fullImage = await generateCarImage(view, brand, model, year, color!);

      // 5. Store full-size in blob (non-fatal if it fails)
      try {
        await cacheImage(key, fullImage);
      } catch (blobErr) {
        console.error("Failed to cache image in blob store:", blobErr);
      }
    }

    // 6. Resize if w/h requested, then return
    const output = await resizeIfNeeded(fullImage, width, height);
    return imageResponse(output);
  } catch (err) {
    if (err instanceof ParamError) {
      return Response.json({ error: err.message }, { status: 400 });
    }

    console.error("Image generation error:", err);
    return Response.json(
      { error: "Image generation failed" },
      { status: 502 }
    );
  }
}
