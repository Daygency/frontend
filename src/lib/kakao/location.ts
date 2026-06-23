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
