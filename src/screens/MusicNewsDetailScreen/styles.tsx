import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  posterWrapper: {
    width: "100%",
  },
  posterImage: {
    backgroundColor: GRAY.MEDIUM,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
    marginRight: 12,
  },
  uploadedAt: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  infoCard: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: BLACK,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
    marginBottom: 20,
  },
  attachmentsCard: {
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 12,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    color: BLACK,
  },
  fileSize: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: GRAY.DARK_100,
  },
  statIcon: {
    marginLeft: 12,
  },
  firstCommentPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  firstCommentText: {
    fontSize: 13,
    color: GRAY.DARK_2,
  },
  commentInputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM,
  },
});

export default styles;
