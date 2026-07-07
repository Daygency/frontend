import { StyleSheet } from "react-native";
import { GRAY, SKELETON } from "../../../color";

const skeletonStyles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  box: {
    borderRadius: 5,
  },
  boxDark: {
    backgroundColor: SKELETON.DARK,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  category: {
    width: 64,
    height: 18,
    marginBottom: 12,
  },
  title: {
    width: "100%",
    height: 48,
    marginBottom: 16,
  },
  authorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorMetaText: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  authorName: {
    width: "60%",
    height: 16,
  },
  postDate: {
    width: "40%",
    height: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY.MEDIUM,
    marginBottom: 16,
  },
  textLine: {
    width: "100%",
    height: 20,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 6,
  },
  bottomBar: {
    marginTop: 24,
    width: "60%",
    height: 56,
  },
});

export default skeletonStyles;
