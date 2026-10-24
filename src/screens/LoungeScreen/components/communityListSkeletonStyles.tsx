import { StyleSheet } from "react-native";
import { GRAY, SKELETON } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const skeletonStyles = themedStyles(() => ({
  box: {
    borderRadius: 5,
  },
  boxDark: {
    backgroundColor: SKELETON.DARK,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  username: {
    width: 56,
    height: 14,
  },
  timestamp: {
    width: 32,
    height: 14,
  },
  title: {
    width: "70%",
    height: 18,
    marginBottom: 8,
  },
  contentLine: {
    width: "100%",
    height: 15,
    marginBottom: 6,
  },
  contentLine2: {
    width: "60%",
    height: 15,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    gap: 20,
  },
  footerItem: {
    width: 28,
    height: 14,
  },
}));

export default skeletonStyles;
