export const CURATION_LOADING_BACKGROUND = "#000000";

export type CurationThemeState = {
  loading: boolean;
  backgroundColor: string;
};

export const DEFAULT_HOME_TAB_BAR_STYLE = {
  paddingTop: 8,
  paddingBottom: 10,
  height: 90,
  backgroundColor: "#ffffff",
  borderTopWidth: 0,
} as const;
