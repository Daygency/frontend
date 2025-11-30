import { StyleSheet, Platform } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrap: {
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  producerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  producerName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  infoContainer: {
    marginTop: 12,
    gap: 8,
  },
  infoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  infoTitle: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "700",
    color: GRAY.DARK_100,
  },
  infoContent: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "500",
    color: BLACK,
  },
  tagAvailable: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "700",
    color: MAIN.DEFAULT,
  },
  cardTitle: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: -0.32,
    color: MAIN.DEFAULT,
  },
  cartWrap: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  applyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: WHITE,...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
        backgroundColor: "#fff",
      },
    }),
  },
  btnApply: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
