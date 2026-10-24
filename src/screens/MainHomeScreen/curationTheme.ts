/** 큐레이션 피드는 포스터 위주의 어두운 화면이라 테마와 무관하게 고정 */
const CURATION_DARK = "#111113";

export const CURATION_LOADING_BACKGROUND = CURATION_DARK;
export const CURATION_TAB_BAR_COLOR = CURATION_DARK;

export type CurationThemeState = {
  loading: boolean;
  backgroundColor: string;
};
