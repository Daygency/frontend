import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  webView: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: WHITE,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: GRAY.DARK_100,
    textAlign: "center",
  },
}));

export default styles;
