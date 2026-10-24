import { BLACK, GRAY, RED, WHITE, FIXED_WHITE, lightDark, MAIN } from "../../../../../color";
import { themedStyles } from "../../../../../theme/themedStyles";

const styles = themedStyles(() => ({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    // borderBottomWidth: 1,
    // borderBottomColor: GRAY.DEFAULT,
  },
  containerPressed: {
    backgroundColor: GRAY.MEDIUM_2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: lightDark("#F2F3F5", "#1F2025"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: lightDark("#4A5568", "#C4C6CC"),
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
    flexShrink: 1,
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
    color: BLACK,
  },
  badge: {
    width: 15,
    height: 15,
    borderRadius: 9,
    backgroundColor: MAIN.FILL,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
  },
  timestamp: {
    flexShrink: 0,
    marginLeft: 8,
    fontSize: 12,
    color: lightDark("#A0AEC0", "#8B8E97"),
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
    color: FIXED_WHITE,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: lightDark("#718096", "#A0A3AB"),
    fontWeight: "500",
  },
}));

export default styles;
