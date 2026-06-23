export const PERFORMANCE_NEWS_SORT_OPTIONS = [
  { id: "created", label: "등록순" },
  { id: "imminent", label: "임박순" },
] as const;

export type PerformanceNewsSortMode =
  (typeof PERFORMANCE_NEWS_SORT_OPTIONS)[number]["id"];

export const PERFORMANCE_NEWS_SORT_LABEL: Record<PerformanceNewsSortMode, string> = {
  created: "등록순",
  imminent: "임박순",
};

export const PERFORMANCE_NEWS_GENRE_OPTIONS = [
  "클래식",
  "재즈",
  "뮤지컬",
  "국악",
  "대중음악",
  "오페라",
  "기타",
] as const;

export const PERFORMANCE_NEWS_REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

export type PerformanceNewsFilterSheetType = "sort" | "genre" | "region";
