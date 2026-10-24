import { Appearance, ColorSchemeName } from "react-native";

export type AppColorScheme = "light" | "dark";

const LIGHT = {
  /** 화면/표면 배경 (다크 모드에서는 어두운 배경) */
  WHITE: "#ffffff",
  /** 기본 텍스트 (다크 모드에서는 밝은 텍스트) */
  BLACK: "#111113",
  GRAY: {
    DEFAULT_1: "#F8F8F8",
    DEFAULT: "#F5F5F5",
    MEDIUM: "#EDEBEB",
    MEDIUM_2: "#E6E6E6",
    DARK_1: "#D9D9D9",
    DARK_2: "#888",
    MEDIUM_100: "#A0A0A0",
    DARK: "#717182",
    DARK_100: "#575757",
  },
  RED: {
    DEFAULT: "#EC1313",
    DARK: "#BE0A0A",
  },
  PURPLE: {
    DEFAULT: "#7C3AED",
  },
  BLUE: {
    LIGHT_1: "#A7B8E266",
    DEFAULT: "#0057D9",
  },
  MAIN: {
    /** 텍스트·아이콘·테두리·포커스 등 강조색 */
    DEFAULT: "#1F2A44",
    // DEFAULT: "#5E8E78",
    // DEFAULT: "black",
    // DEFAULT: "#1a47a6",
    /** 흰 글자가 올라가는 버튼·토글 등 채움색 */
    FILL: "#1F2A44",
    LIGHT: "#B0B7C9",
  },
  SKELETON: {
    DARK: "#F4F4F4",
    LIGHT: "#F8F8F8",
  },
  /** 이미지 위 어둡게 깔리는 오버레이 등, 테마와 무관한 검정 */
  SCRIM: "rgba(0,0,0,0.5)",
};

type Palette = typeof LIGHT;

const DARK: Palette = {
  WHITE: "#16171B",
  BLACK: "#EDEDEF",
  GRAY: {
    DEFAULT_1: "#1B1C21",
    DEFAULT: "#1F2025",
    MEDIUM: "#2A2B31",
    MEDIUM_2: "#2C2D33",
    DARK_1: "#3A3B42",
    DARK_2: "#A0A3AB",
    MEDIUM_100: "#73767F",
    DARK: "#9A9DA6",
    DARK_100: "#C4C6CC",
  },
  RED: {
    DEFAULT: "#FF5A5A",
    DARK: "#FF7A7A",
  },
  PURPLE: {
    DEFAULT: "#A78BFA",
  },
  BLUE: {
    LIGHT_1: "#5B76B866",
    DEFAULT: "#4C8DFF",
  },
  MAIN: {
    DEFAULT: "#8FA3D9",
    FILL: "#4D67A8",
    LIGHT: "#2E3854",
  },
  SKELETON: {
    DARK: "#24252B",
    LIGHT: "#1D1E23",
  },
  SCRIM: "rgba(0,0,0,0.6)",
};

export const PALETTES: Record<AppColorScheme, Palette> = {
  light: LIGHT,
  dark: DARK,
};

/** 테마와 무관하게 항상 흰색 (MAIN/RED 버튼 위 글자, 사진 위 아이콘 등) */
export const FIXED_WHITE = "#ffffff";
/** 테마와 무관하게 항상 검정 (사진 뷰어 배경 등) */
export const FIXED_BLACK = "#000000";

export const toColorScheme = (scheme: ColorSchemeName): AppColorScheme =>
  scheme === "dark" ? "dark" : "light";

/**
 * 아래 토큰들은 현재 컬러 스킴에 맞춰 값이 바뀐다 (applyColorScheme).
 * 렌더 중에 읽으면 항상 현재 테마 값이고, 모듈 최상단에서 값을 복사해 두면 고정되므로
 * 스타일은 themedStyles(), 그 외 상수는 함수/렌더 시점에 읽도록 한다.
 */
export let colorScheme: AppColorScheme = toColorScheme(
  Appearance.getColorScheme(),
);
export let WHITE = PALETTES[colorScheme].WHITE;
export let BLACK = PALETTES[colorScheme].BLACK;
export let SCRIM = PALETTES[colorScheme].SCRIM;
export const GRAY = { ...PALETTES[colorScheme].GRAY };
export const RED = { ...PALETTES[colorScheme].RED };
/** D-day 태그: 마감 10일 이내 강조용 */
export const PURPLE = { ...PALETTES[colorScheme].PURPLE };
export const BLUE = { ...PALETTES[colorScheme].BLUE };
export const MAIN = { ...PALETTES[colorScheme].MAIN };
/** 로딩 스켈레톤 박스 색상 */
export const SKELETON = { ...PALETTES[colorScheme].SKELETON };

export const applyColorScheme = (scheme: AppColorScheme) => {
  if (scheme === colorScheme) return;
  const p = PALETTES[scheme];
  colorScheme = scheme;
  WHITE = p.WHITE;
  BLACK = p.BLACK;
  SCRIM = p.SCRIM;
  Object.assign(GRAY, p.GRAY);
  Object.assign(RED, p.RED);
  Object.assign(PURPLE, p.PURPLE);
  Object.assign(BLUE, p.BLUE);
  Object.assign(MAIN, p.MAIN);
  Object.assign(SKELETON, p.SKELETON);
};

/**
 * 라이트 모드에서는 기존 hex 값을 그대로 쓰고, 다크 모드에서만 다른 값을 쓰고 싶을 때.
 * themedStyles 팩토리 안이나 렌더 중에 호출해야 현재 스킴이 반영된다.
 */
export const lightDark = (light: string, dark: string) =>
  colorScheme === "dark" ? dark : light;
