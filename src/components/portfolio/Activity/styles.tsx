import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  embeddedContainer: {
    backgroundColor: "transparent",
    marginTop: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  activityItem: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    flex: 1,
  },
  activityTypeBadge: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  activityTypeText: {
    fontSize: 11,
    fontWeight: "500",
    color: WHITE,
  },
  activityInfo: {
    gap: 8,
  },
  activityInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activityInfoText: {
    fontSize: 13,
    lineHeight: 18,
    color: GRAY.DARK,
    fontWeight: "400",
  },
});

export default styles;
