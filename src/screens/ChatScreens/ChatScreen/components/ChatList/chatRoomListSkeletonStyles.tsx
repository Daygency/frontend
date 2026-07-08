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
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    width: 96,
    height: 16,
  },
  timestamp: {
    width: 36,
    height: 12,
  },
  message: {
    width: "70%",
    height: 14,
  },
});

export default skeletonStyles;
