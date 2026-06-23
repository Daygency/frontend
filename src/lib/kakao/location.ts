export type KakaoLocationValue = {
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export function parseCoord(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function hasMapCoords(
  value: Pick<KakaoLocationValue, "latitude" | "longitude">,
): value is { latitude: number; longitude: number } {
  return (
    typeof value.latitude === "number" &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === "number" &&
    Number.isFinite(value.longitude)
  );
}

export function getKakaoMapLink(latitude: number, longitude: number): string {
  return `https://map.kakao.com/link/map/${latitude},${longitude}`;
}

export function getNativeMapOpenLabel(platform: "ios" | "android" | "web" = "ios"): string {
  return platform === "ios" ? "Apple 지도에서 보기" : "Google 지도에서 보기";
}

export function getNativeMapLink(options: {
  latitude?: number | null;
  longitude?: number | null;
  place?: string;
  platform?: "ios" | "android" | "web";
}): string | null {
  const label = options.place?.trim() ?? "";
  const platform = options.platform ?? "ios";
  const hasCoords = hasMapCoords({
    latitude: options.latitude ?? null,
    longitude: options.longitude ?? null,
  });

  if (platform === "ios") {
    if (hasCoords) {
      const base = `http://maps.apple.com/?ll=${options.latitude},${options.longitude}`;
      return label ? `${base}&q=${encodeURIComponent(label)}` : base;
    }
    if (label) {
      return `http://maps.apple.com/?q=${encodeURIComponent(label)}`;
    }
    return null;
  }

  if (hasCoords) {
    if (label) {
      return `geo:${options.latitude},${options.longitude}?q=${encodeURIComponent(label)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${options.latitude},${options.longitude}`;
  }
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;
  }
  return null;
}
