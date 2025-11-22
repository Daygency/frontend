import { StyleSheet } from "react-native";
import { MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  portfolioButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 40,
    backgroundColor: MAIN.DEFAULT,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portfolioTitle: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
    marginLeft: 22,
    lineHeight: 17,
  },
  icon: {
    position: "absolute",
    left: 8,
    justifyContent: "center",
  },
});

export default styles;

