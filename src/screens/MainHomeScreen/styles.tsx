import { StyleSheet } from "react-native";
import { WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    position: "relative",
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
  fab: {
    position: "absolute",
    zIndex: 50,
    elevation: 50,
  },
}));

export default styles;








