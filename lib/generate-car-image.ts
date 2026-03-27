import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export async function generateCarImage(
  view: string,
  brand: string,
  model: string,
  year: string,
  color: string
): Promise<Buffer> {
  const viewPrompt =
    view === "front"
      ? [
          `A small ${color} ${year} ${brand} ${model} seen from directly in front, centered in the image.`,
          `The car faces the viewer head-on. The full front of the car is visible including the bumper, hood, headlights, and grille.`,
          `The car takes up 80% of the image width. There is empty space on all four sides.`,
          `The license plate is blank/empty with no text or numbers on it.`,
        ]
      : [
          `A small ${color} ${year} ${brand} ${model} seen from the side, centered in the image.`,
          `The car is shown in a perfect side profile. The full car is visible from front bumper to rear bumper — nothing is cropped.`,
          `The car takes up 80% of the image width. There is empty space on all four sides.`,
          `The license plate is blank/empty with no text or numbers on it.`,
        ];

  const prompt = [
    ...viewPrompt,
    `No ground, no shadows, no reflections, no environment. Transparent background only.`,
    `Studio lighting, high detail, realistic, isolated product photo.`,
  ].join(" ");

  const response = await getClient().images.generate({
    model: "gpt-image-1.5",
    prompt,
    size: "1024x1024",
    quality: "medium",
    background: "transparent",
    output_format: "png",
  } as Parameters<OpenAI["images"]["generate"]>[0]);

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI returned no image data");
  }

  return Buffer.from(b64, "base64");
}
