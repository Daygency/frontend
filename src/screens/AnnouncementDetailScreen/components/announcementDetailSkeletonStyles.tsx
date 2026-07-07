import { StyleSheet } from "react-native";
import { GRAY, SKELETON, WHITE } from "../../../color";

const skeletonStyles = StyleSheet.create({
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
  title: {
    width: "100%",
    height: 40,
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    width: 110,
    height: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  infoLabel: {
    width: 72,
    height: 22,
  },
  infoValue: {
    width: 150,
    height: 22,
  },
  blankSpace: {
    height: 80,
  },
  divider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginBottom: 24,
  },
  textSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    width: 100,
    height: 22,
    marginBottom: 12,
  },
  textLine: {
    width: "100%",
    height: 28,
    marginBottom: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM_2,
  },
  bookmarkButton: {
    width: 52,
    height: 56,
  },
  mainButton: {
    flex: 1,
    height: 56,
  },
});

export default skeletonStyles;
