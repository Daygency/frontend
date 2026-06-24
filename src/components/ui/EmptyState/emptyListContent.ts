import type { StyleProp, ViewStyle } from "react-native";

/** FlatList `contentContainerStyle` when the list has no items */
export const emptyListContentStyle: ViewStyle = {
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
};

/** Full-screen empty body (non-FlatList) */
export const emptyScreenStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

/** Embedded section empty (e.g. portfolio preview) */
export const emptySectionStyle: ViewStyle = {
  minHeight: 120,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 24,
};

export function contentContainerWhenEmpty(
  isEmpty: boolean,
  base?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  if (!isEmpty) return base;
  return base ? [base, emptyListContentStyle] : emptyListContentStyle;
}
