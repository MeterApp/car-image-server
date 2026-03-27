import { list, put } from "@vercel/blob";

export function buildBlobKey(
  view: string,
  brand: string,
  model: string,
  year: string,
  color: string
): string {
  const b = brand.replace(/\s+/g, "-");
  const m = model.replace(/\s+/g, "-");
  const c = color.replace(/\s+/g, "-");
  return `cars/${b}/${m}/${year}/${c}-${view}.png`;
}

export async function getCachedImage(key: string): Promise<Buffer | null> {
  const { blobs } = await list({ prefix: key, limit: 1 });
  const match = blobs.find((b) => b.pathname === key);
  if (!match) return null;

  const res = await fetch(match.url);
  if (!res.ok) return null;

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export async function cacheImage(key: string, buffer: Buffer): Promise<void> {
  await put(key, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/png",
  });
}
