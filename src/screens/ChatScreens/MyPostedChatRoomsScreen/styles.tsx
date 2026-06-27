import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";

const NAVY = "#1F2A44";
const ORANGE = "#F97316";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  postCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: GRAY.MEDIUM_2,
  },
  postContent: {
    flex: 1,
    minWidth: 0,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  postTagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  tagChip: {
    ...SMOOTH_CORNERS,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tagChipOrange: {
    backgroundColor: "#FFEDD5",
  },
  tagTextOrange: {
    color: ORANGE,
  },
  tagChipGray: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  tagTextGray: {
    color: "#111827",
  },
  tagChipNavy: {
    backgroundColor: NAVY,
  },
  tagTextNavy: {
    color: WHITE,
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

