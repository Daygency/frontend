import { StyleSheet } from "react-native";
import { BLACK, WHITE } from "../../color";

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.3,
    color: BLACK,
    fontWeight: "500",
  },
  dateBadge: {
    backgroundColor: BLACK,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dateBadgeText: {
    color: WHITE,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.24,
    fontWeight: "500",
  },
});

export default styles;





