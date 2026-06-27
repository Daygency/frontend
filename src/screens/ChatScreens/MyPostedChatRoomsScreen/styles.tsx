import { StyleSheet } from "react-native";
import { WHITE } from "../../../color";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  announcementCardWrap: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  roomsCountLabel: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  listContent: {
    paddingBottom: 20,
  },
});
