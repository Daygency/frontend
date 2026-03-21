import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../../components/MainHomeTopBar/styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    width: "100%",
    height: MAIN_HOME_TOP_BAR_HEIGHT,
    flexDirection: "row",
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconButton: {
    position: "relative",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topTabsRow: {
    flexDirection: "row",
    paddingHorizontal: 17,
    gap: 10,
    paddingTop: 6,
    paddingBottom: 10,
  },
  topTab: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 16,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  topTabSelected: {
    backgroundColor: "#1F2A44",
    borderColor: "#1F2A44",
  },
  topTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  topTabTextSelected: {
    color: WHITE,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E11D48",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "700",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default styles;
