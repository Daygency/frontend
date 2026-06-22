type Rgb = { r: number; g: number; b: number };

const FALLBACK_COLOR = "#1a1a1a";
const colorCache = new Map<string, string>();

const rgbToHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;

const isPng = (bytes: Uint8Array) =>
  bytes.length >= 4 &&
  bytes[0] === 0x89 &&
  bytes[1] === 0x50 &&
  bytes[2] === 0x4e &&
  bytes[3] === 0x47;

const isJpeg = (bytes: Uint8Array) =>
  bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8;

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const { buffer, byteOffset, byteLength } = bytes;
  if (byteOffset === 0 && byteLength === buffer.byteLength) {
    return buffer as ArrayBuffer;
  }
  return bytes.slice().buffer;
};

const averageRgba = (pixels: Uint8Array, sampleStep = 16) => {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
    const alpha = pixels[i + 3];
    if (alpha < 16) continue;
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
    count += 1;
  }

  if (count === 0) return FALLBACK_COLOR;

  return rgbToHex({
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  });
};

const decodeImagePixels = async (bytes: Uint8Array, contentType: string) => {
  const [{ decode: decodeJpeg }, upngModule] = await Promise.all([
    import("jpeg-js"),
    import("upng-js"),
  ]);
  const UPNG = upngModule.default;

  if (contentType.includes("png") || isPng(bytes)) {
    const decoded = UPNG.decode(toArrayBuffer(bytes));
    return new Uint8Array(UPNG.toRGBA8(decoded)[0]);
  }

  if (contentType.includes("jpeg") || contentType.includes("jpg") || isJpeg(bytes)) {
    return decodeJpeg(bytes, { useTArray: true }).data;
  }

  throw new Error("Unsupported image format");
};

export async function getImageAverageColor(imageUrl: string): Promise<string> {
  const cached = colorCache.get(imageUrl);
  if (cached) return cached;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return FALLBACK_COLOR;

    const bytes = new Uint8Array(await response.arrayBuffer());
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const pixels = await decodeImagePixels(bytes, contentType);
    const averageColor = averageRgba(pixels);

    colorCache.set(imageUrl, averageColor);
    return averageColor;
  } catch {
    return FALLBACK_COLOR;
  }
}
