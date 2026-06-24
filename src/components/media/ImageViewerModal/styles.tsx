import { StyleSheet } from "react-native";
import { WHITE } from "../../../color";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#2E2E2E",
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  imageArea: {
    flex: 1,
    justifyContent: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 56,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    color: WHITE,
  },
});

export default styles;
