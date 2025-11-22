import { StyleSheet } from "react-native";
import { BLACK, WHITE } from "../../color";

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "400",
  },
  dateBadge: {
    backgroundColor: BLACK,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default styles;



