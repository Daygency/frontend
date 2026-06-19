export function hasCompleteYearMonth(year: string, month: string): boolean {
  return Boolean(year?.trim() && month?.trim());
}

export function formatYearMonth(year: string, month: string): string {
  if (!hasCompleteYearMonth(year, month)) return "";
  return `${year.trim()}.${month.trim().padStart(2, "0")}`;
}

export function formatPeriod(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  options?: { isOngoing?: boolean; ongoingLabel?: string },
): string {
  const start = formatYearMonth(startYear, startMonth);
  const end = formatYearMonth(endYear, endMonth);
  const isOngoing = options?.isOngoing ?? false;
  const ongoingLabel = options?.ongoingLabel?.trim() ?? "";

  if (isOngoing && ongoingLabel) {
    return start ? `${start} ~ ${ongoingLabel}` : ongoingLabel;
  }
  if (!start && !end) return "";
  if (start && end) return `${start} ~ ${end}`;
  return start || end;
}

export function yearMonthFromApiDate(
  value: string | Date | undefined | null,
): { year: string; month: string } {
  if (!value) return { year: "", month: "" };
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return { year: "", month: "" };
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, "0"),
  };
}

export function formatYearMonthFromApiDate(
  value: string | Date | undefined | null,
): string {
  const { year, month } = yearMonthFromApiDate(value);
  return formatYearMonth(year, month);
}

export function formatPeriodFromApiItem(
  item: {
    startedAt?: string | Date | null;
    endedAt?: string | Date | null;
    isOngoing?: boolean;
  },
  options?: { ongoingLabel?: string },
): string {
  const start = yearMonthFromApiDate(item.startedAt);
  const end = yearMonthFromApiDate(item.endedAt);
  return formatPeriod(start.year, start.month, end.year, end.month, {
    isOngoing: Boolean(item.isOngoing),
    ongoingLabel: options?.ongoingLabel,
  });
}

export function toOptionalIsoDate(
  year: string,
  month: string,
): string | null {
  if (!hasCompleteYearMonth(year, month)) return null;
  const y = Number(year);
  const m = Number(month);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
    return null;
  }
  return new Date(y, m - 1, 1).toISOString();
}

function parseApiDateToTimestamp(
  value: string | Date | undefined | null,
): number {
  if (!value) return 0;
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

/** 학력·경력: 재학/재직 중 → 최상단, 그 외 종료일 → 시작일 순으로 최신 우선 */
export function getPeriodEntrySortKey(item: {
  startedAt?: string | Date | null;
  endedAt?: string | Date | null;
  isOngoing?: boolean;
}): number {
  const start = parseApiDateToTimestamp(item.startedAt);
  if (item.isOngoing) {
    return 1e15 + start;
  }
  const end = parseApiDateToTimestamp(item.endedAt);
  if (end > 0) return end;
  return start;
}

export function getAwardEntrySortKey(item: {
  awardedAt?: string | Date | null;
}): number {
  return parseApiDateToTimestamp(item.awardedAt);
}

export function getCertificateEntrySortKey(item: {
  obtainedAt?: string | Date | null;
}): number {
  return parseApiDateToTimestamp(item.obtainedAt);
}

export function sortByRecentDesc<T>(
  items: T[] | null | undefined,
  getSortKey: (item: T) => number,
): T[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return [...items].sort((a, b) => getSortKey(b) - getSortKey(a));
}
