import type { Major } from "../apis/announcement/majorApi";

/** 프로필 수정 화면의 전공 라벨 → 백엔드 major UUID */
export function resolveProfileMajorUuid(
  majorLabel: string,
  catalog: Major[],
): string | undefined {
  const label = majorLabel.trim();
  if (!label || catalog.length === 0) return undefined;

  const exact = catalog.find((m) => m.name === label);
  if (exact) return exact.majorId;

  const other = catalog.find((m) => m.name === "기타");
  return other?.majorId;
}
