import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 96,
  },
  header: {
    marginBottom: 16,
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: GRAY.MEDIUM,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    color: BLACK,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  body: {
    marginTop: 16,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: BLACK,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  statText: {
    fontSize: 12,
    color: GRAY.DARK_100,
  },
  dot: {
    fontSize: 12,
    color: GRAY.DARK_100,
    marginHorizontal: 4,
  },
  firstCommentPlaceholder: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  firstCommentText: {
    fontSize: 13,
    color: GRAY.DARK_2,
  },
  commentInputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 90,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM,
  },
  anonymousToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GRAY.DARK_2,
    marginRight: 6,
  },
  anonymousText: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  commentInput: {
    fontSize: 13,
    color: BLACK,
    maxHeight: 80,
  },
});

export default styles;

