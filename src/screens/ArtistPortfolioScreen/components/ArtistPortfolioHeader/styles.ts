import { StyleSheet } from "react-native";
import { BLACK, WHITE } from "../../../../color";

const NAVY = "#1F2A44";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: WHITE,
  },
  topRow: {
    minHeight: 40,
    justifyContent: "center",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  activityName: {
    fontSize: 22,
    fontWeight: "700",
    color: BLACK,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
    paddingRight: 4,
  },
  actionBtn: {
    minWidth: 88,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnFollow: {
    backgroundColor: NAVY,
  },
  actionBtnTextFollow: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  actionBtnFollowing: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: NAVY,
  },
  actionBtnTextFollowing: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "600",
  },
  actionBtnBlock: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  actionBtnTextBlock: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;
