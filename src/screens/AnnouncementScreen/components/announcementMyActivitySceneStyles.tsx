import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../color";

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerFill: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: BLACK,
    marginTop: 20,
    marginBottom: 12,
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 16,
    paddingVertical: 22,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: GRAY.DARK_1,
  },
  statLabel: {
    fontSize: 13,
    color: GRAY.DARK,
    textAlign: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "400",
    color: BLACK,
  },
  myPostSection: {
    marginTop: 32,
  },
});

export default styles;
