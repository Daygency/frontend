/**
 * API `dDay` 문자열(예: "D-5", "D-0")을 일수로 파싱합니다.
 * 마감일이 지난 경우 음수가 올 수 있습니다(예: "D--1" → -1).
 */
export function parseAnnouncementDaysLeft(
  dDay: string | undefined | null,
): number {
  if (dDay == null || !String(dDay).trim()) return 0;
  const s = String(dDay).trim();
  const afterD = s.replace(/^D-?/i, "").trim();
  if (afterD === "") return 0;
  const n = parseInt(afterD, 10);
  return Number.isFinite(n) ? n : 0;
}
