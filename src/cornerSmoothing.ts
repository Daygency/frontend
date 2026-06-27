import { Platform, type ViewStyle } from "react-native";

/** iOS continuous corner curve (squircle). No-op on Android. */
export const SMOOTH_CORNERS: ViewStyle = Platform.select({
  ios: { borderCurve: "continuous" },
  default: {},
})!;
