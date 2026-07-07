import { StyleSheet } from "react-native";
import { GRAY, SKELETON, WHITE } from "../../../color";

const skeletonStyles = StyleSheet.create({
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
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    overflow: "hidden",
    marginBottom: 5,
  },
  topSection: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  authorName: {
    width: 70,
    height: 18,
    marginRight: 8,
  },
  dDay: {
    width: 36,
    height: 18,
    marginLeft: "auto",
  },
  title: {
    width: "70%",
    height: 20,
  },
  footerSection: {
    backgroundColor: GRAY.DEFAULT_1,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  tagsGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  priceTag: {
    width: 48,
    height: 16,
  },
  typeTag: {
    width: 64,
    height: 20,
    borderRadius: 4,
  },
  locationTag: {
    width: 36,
    height: 16,
  },
  footerMeta: {
    width: 72,
    height: 16,
  },
});

export default skeletonStyles;
