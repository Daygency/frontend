import { StyleSheet } from "react-native";
import { BLACK, GRAY, RED, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 17,
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GRAY.MEDIUM,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 10,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: WHITE,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  timestampContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: GRAY.DARK,
    fontWeight: "400",
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: RED.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: "600",
    color: WHITE,
  },
  message: {
    fontSize: 14,
    color: GRAY.DARK,
    fontWeight: "400",
  },
});

export default styles;
