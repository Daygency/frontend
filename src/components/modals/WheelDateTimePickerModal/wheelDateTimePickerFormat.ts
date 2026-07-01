const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatKoreanDateLabel(date: Date): string {
  const today = new Date();
  if (isSameDay(date, today)) return "오늘";

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, tomorrow)) return "내일";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${month}월 ${day}일 ${weekday}`;
}

export function formatKoreanTimeLabel(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${hour12}:${String(minutes).padStart(2, "0")}`;
}

export function buildConfirmLabel(
  date: Date,
  mode: "date" | "time" | "datetime",
): string {
  if (mode === "date") {
    return `${formatKoreanDateLabel(date)} 선택`;
  }
  if (mode === "time") {
    return `${formatKoreanTimeLabel(date)} 선택`;
  }
  return `${formatKoreanDateLabel(date)} ${formatKoreanTimeLabel(date)} 선택`;
}
