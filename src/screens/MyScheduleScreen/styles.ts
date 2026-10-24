import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  center: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: BLACK,
  },
  relative: {
    fontSize: 12,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  rowPressed: {
    opacity: 0.6,
  },
  time: {
    width: 64,
    fontSize: 13,
    color: GRAY.DARK,
    paddingTop: 1,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  kind: {
    fontSize: 11,
    fontWeight: "600",
  },
  kindScheduled: {
    color: MAIN.DEFAULT,
  },
  kindDeadline: {
    color: GRAY.DARK_2,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: BLACK,
  },
  meta: {
    fontSize: 12,
    color: GRAY.DARK,
  },
});

export default styles;
