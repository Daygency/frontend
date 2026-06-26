import { BLACK, WHITE } from "../../color";

export const CURATION_LOADING_BACKGROUND = BLACK;
export const CURATION_TAB_BAR_COLOR = WHITE;

export type CurationThemeState = {
  loading: boolean;
  backgroundColor: string;
};
