import { StyleSheet } from "react-native";
import { SKELETON } from "../../../color";

const skeletonStyles = StyleSheet.create({
  box: {
    borderRadius: 5,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  statValue: {
    width: 24,
    height: 22,
  },
});

export default skeletonStyles;
