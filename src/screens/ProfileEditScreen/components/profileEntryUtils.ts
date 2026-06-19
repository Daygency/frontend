export const formatPeriod = (
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
): string => {
  const fmt = (year: string, month: string) =>
    year && month ? `${year}.${month.padStart(2, "0")}` : year || "";
  const start = fmt(startYear, startMonth);
  const end = fmt(endYear, endMonth);
  if (!start && !end) return "";
  if (!end && startYear && startMonth) return `${start} - 현재`;
  if (!end) return start;
  return `${start} ~ ${end}`;
};

export const formatYearMonth = (year: string, month: string): string => {
  if (year && month) return `${year}.${month.padStart(2, "0")}`;
  return year || "";
};
