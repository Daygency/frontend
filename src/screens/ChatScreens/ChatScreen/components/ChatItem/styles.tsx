import { StyleSheet } from "react-native";
import { BLACK, GRAY, RED, WHITE } from "../../../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: WHITE,
    // borderBottomWidth: 1,
    // borderBottomColor: GRAY.DEFAULT,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#F2F3F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A5568",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: WHITE,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A202C",
  },
  badge: {
    width: 15,
    height: 15,
    borderRadius: 9,
    backgroundColor: "#1F2A44",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
  },
  timestamp: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: "400",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
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
    fontSize: 10,
    fontWeight: "600",
    color: WHITE,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
  },
});

export default styles;
