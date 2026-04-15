/**
 * 로컬 캘린더 기준 마감일까지 남은 일수.
 * 마감일이 오늘 이전이면 음수, 오늘이면 0, 이후면 양수.
 * API `dDay`가 갱신되지 않았을 때 표시를 맞추기 위해 사용합니다.
 */
export function calendarDaysUntilDeadline(
  deadlineIso: string | undefined | null,
): number | null {
  if (deadlineIso == null || !String(deadlineIso).trim()) return null;
  const d = new Date(String(deadlineIso).trim());
  if (isNaN(d.getTime())) return null;
  const deadline = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((deadline.getTime() - today.getTime()) / 86400000);
}

export function effectiveAnnouncementDaysLeft(
  deadlineAt: string | undefined | null,
  parsedDaysLeft: number,
): number {
  const cal = calendarDaysUntilDeadline(deadlineAt);
  return cal !== null ? cal : parsedDaysLeft;
}

export function isAnnouncementDeadlinePassed(
  daysLeft: number,
  status: string,
): boolean {
  return daysLeft < 0 || (daysLeft === 0 && status === "모집마감");
}

export function formatAnnouncementDDayLabel(
  daysLeft: number,
  status: string,
): string {
  if (isAnnouncementDeadlinePassed(daysLeft, status)) return "마감";
  if (daysLeft === 0) return "오늘마감";
  return `D-${daysLeft}`;
}
