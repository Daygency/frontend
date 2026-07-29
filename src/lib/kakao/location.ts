export function getNativeMapOpenLabel(platform: "ios" | "android" | "web" = "ios"): string {
  return platform === "ios" ? "Apple 지도에서 보기" : "Google 지도에서 보기";
}

export function getNativeMapLink(options: {
  place?: string;
  platform?: "ios" | "android" | "web";
}): string | null {
  const label = options.place?.trim() ?? "";
  if (!label) return null;
  const platform = options.platform ?? "ios";

  if (platform === "ios") {
    return `http://maps.apple.com/?q=${encodeURIComponent(label)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;
}
