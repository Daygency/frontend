/** 티켓 오픈/공연 시작 시각 라벨 (예: 내일 16:00) */
export function formatPerformanceOpenLabel(iso?: string): string {
  if (!iso?.trim()) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const timeLabel = `${hours}:${minutes}`;

  if (diffDays === 0) return `오늘 ${timeLabel}`;
  if (diffDays === 1) return `내일 ${timeLabel}`;
  if (diffDays === -1) return `어제 ${timeLabel}`;

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${timeLabel}`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatSingleListDate(
  date: Date,
  now: Date,
  includeYear: boolean,
): string {
  if (includeYear) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "내일";
  if (diffDays === -1) return "어제";

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 공연소식 목록용 날짜 라벨 (시간 없음, 종료일 있으면 `~` 범위) */
export function formatPerformanceListDateLabel(
  startedAt?: string,
  endedAt?: string | null,
): string {
  if (!startedAt?.trim()) return "";

  const start = new Date(startedAt);
  if (Number.isNaN(start.getTime())) return "";

  const now = new Date();
  const endIso = endedAt?.trim();
  if (!endIso) {
    return formatSingleListDate(start, now, false);
  }

  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) {
    return formatSingleListDate(start, now, false);
  }

  if (isSameCalendarDay(start, end)) {
    return formatSingleListDate(start, now, false);
  }

  const includeYear = start.getFullYear() !== end.getFullYear();
  const startLabel = formatSingleListDate(start, now, includeYear);
  const endLabel = formatSingleListDate(end, now, includeYear);
  return `${startLabel} ~ ${endLabel}`;
}

export function pickNewsOpenTime(item: {
  openedAt?: string;
  startedAt?: string;
}): string {
  return item.openedAt?.trim() || item.startedAt?.trim() || "";
}
