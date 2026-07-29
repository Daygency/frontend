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

/** 모집 마감일(날짜)이 오늘보다 이전이면 true. 마감일이 없으면 false. */
export function isRecruitmentDeadlineDatePassed(
  deadlineAt: string | undefined | null,
): boolean {
  const n = calendarDaysUntilDeadline(deadlineAt);
  return n !== null && n < 0;
}

export function effectiveAnnouncementDaysLeft(
  deadlineAt: string | undefined | null,
  parsedDaysLeft: number,
): number {
  const cal = calendarDaysUntilDeadline(deadlineAt);
  return cal !== null ? cal : parsedDaysLeft;
}

/**
 * 서버의 isRecruiting/completed 값을 그대로 신뢰한다. 마감일이 지났다고 클라이언트에서
 * 임의로 "모집마감"으로 덮어쓰지 않음 — 그렇게 하면 작성자가 상태 변경 버튼으로 마감일이
 * 지난 공고를 "모집중"으로 수동 전환해도 재조회 시 다시 "모집마감"으로 되돌아가 버림.
 */
export function resolveAnnouncementRecruitmentStatus(
  isRecruiting: boolean,
  options?: {
    completed?: boolean;
    deadlineAt?: string | null;
  },
): "모집중" | "모집마감" {
  if (options?.completed) return "모집마감";
  return isRecruiting ? "모집중" : "모집마감";
}

export function isAnnouncementRecruitingOpen(
  isRecruiting: boolean,
  completed?: boolean,
): boolean {
  if (completed) return false;
  return isRecruiting;
}

export function isAnnouncementDeadlinePassed(
  daysLeft: number,
  status: string,
): boolean {
  return status === "모집마감" || daysLeft < 0;
}

export function formatAnnouncementDDayLabel(
  daysLeft: number,
  status: string,
  completed?: boolean,
  deadlineAt?: string | null,
): string {
  if (completed || status === "모집마감" || daysLeft < 0) return "마감";
  if (deadlineAt == null || !String(deadlineAt).trim()) {
    if (status === "모집중") return "상시";
  }
  if (daysLeft === 0) return "오늘마감";
  return `D-${daysLeft}`;
}

/** 상태 칩이 이미 "마감"일 때 D-day 칩까지 "마감"으로 중복 표시하지 않음 */
export function shouldShowAnnouncementDDayChip(
  isRecruiting: boolean,
  dDay?: string | null,
): boolean {
  if (!dDay?.trim()) return false;
  if (!isRecruiting && dDay.trim() === "마감") return false;
  return true;
}
