export type AnnouncementFilterSheetType =
  | "feed"
  | "sort"
  | "status"
  | "type"
  | "major"
  | "price";

export const ANNOUNCEMENT_SORT_OPTIONS = ["임박순", "등록순"] as const;
export type AnnouncementSortOption =
  (typeof ANNOUNCEMENT_SORT_OPTIONS)[number];

export const ANNOUNCEMENT_FILTER_SHEET_TITLES: Record<
  AnnouncementFilterSheetType,
  string
> = {
  feed: "공고 보기",
  sort: "정렬",
  status: "모집 상태",
  type: "공고 유형",
  major: "모집 전공",
  price: "금액 유형",
};

export function getFilterChipLabel(
  defaultLabel: string,
  selectedValues: string[],
): string {
  if (selectedValues.length === 0) return defaultLabel;
  if (selectedValues.length === 1) return selectedValues[0];
  return `${defaultLabel} (${selectedValues.length})`;
}
