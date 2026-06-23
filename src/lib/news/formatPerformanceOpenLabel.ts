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

export function pickNewsOpenTime(item: {
  openedAt?: string;
  startedAt?: string;
}): string {
  return item.openedAt?.trim() || item.startedAt?.trim() || "";
}
