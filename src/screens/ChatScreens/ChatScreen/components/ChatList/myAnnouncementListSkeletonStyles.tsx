import { StyleSheet } from "react-native";
import { SKELETON, WHITE } from "../../../../../color";

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
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  titleWithCount: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 8,
  },
  title: {
    width: 140,
    height: 18,
  },
  personCount: {
    width: 24,
    height: 14,
  },
  dDay: {
    width: 32,
    height: 14,
  },
  tagsRow: {
    marginTop: 10,
  },
  typeTag: {
    width: 48,
    height: 20,
    borderRadius: 4,
  },
});

export default skeletonStyles;
