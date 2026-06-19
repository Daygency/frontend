/** 검색 화면 탭 — 앱 주요 콘텐츠 기준 */
export const CategoryList = [
  "전체",
  "모집공고",
  "공연소식",
  "커뮤니티",
  "아티스트",
] as const;

export type SearchCategory = (typeof CategoryList)[number];

export const SUGGESTED_SEARCH_TAGS = [
  "모집공고",
  "공연소식",
  "커뮤니티",
  "아티스트",
] as const;

export const TAG_TO_SEARCH_CATEGORY: Record<string, SearchCategory> = {
  모집공고: "모집공고",
  채용: "모집공고",
  공연소식: "공연소식",
  커뮤니티: "커뮤니티",
  아티스트: "아티스트",
};

export function parseRecentSearchTerm(term: string): {
  tag: string | null;
  query: string;
} {
  const trimmed = term.trim();
  if (!trimmed) return { tag: null, query: "" };
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  if (TAG_TO_SEARCH_CATEGORY[first]) {
    return { tag: first, query: parts.slice(1).join(" ") };
  }
  return { tag: null, query: trimmed };
}
