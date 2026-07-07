import { StyleSheet } from "react-native";
import { GRAY, SKELETON } from "../../../color";

const skeletonStyles = StyleSheet.create({
  hero: {
    width: "100%",
    height: 168,
    marginBottom: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  box: {
    borderRadius: 5,
  },
  boxDark: {
    backgroundColor: SKELETON.DARK,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    flex: 1,
    height: 28,
  },
  titleActions: {
    flexDirection: "row",
    gap: 12,
  },
  titleActionItem: {
    width: 28,
    height: 21,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoLabel: {
    width: 72,
    height: 20,
  },
  infoValue: {
    width: 150,
    height: 20,
  },
  bodySectionBlock: {
    marginTop: 10,
    marginBottom: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  sectionLabel: {
    width: 60,
    height: 18,
    marginBottom: 10,
  },
  textLine: {
    width: "100%",
    height: 20,
    marginBottom: 8,
  },
  actionDivider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginTop: 4,
    marginBottom: 14,
  },
  actionRow: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  actionItem: {
    width: 60,
    height: 19,
  },
  commentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentBody: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  commentAuthor: {
    width: "35%",
    height: 14,
  },
  commentLine: {
    width: "90%",
    height: 18,
  },
});

export default skeletonStyles;
