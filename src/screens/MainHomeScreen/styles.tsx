import { StyleSheet } from "react-native";
import { WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
  },
  sceneStack: {
    flex: 1,
    position: "relative",
  },
  sceneLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  curationLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default styles;








