import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";
import { PORTFOLIO_BODY_BG, PORTFOLIO_SECTION_GAP } from "../../../constants/portfolio";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 10,
  },
  embeddedRoot: {
    backgroundColor: PORTFOLIO_BODY_BG,
  },
  embeddedSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  entryList: {},
  entryRow: {
    flexDirection: "row",
  },
  timelineTrack: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: MAIN.DEFAULT,
    backgroundColor: WHITE,
    marginTop: 6,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: GRAY.DARK_1,
    marginTop: 4,
    minHeight: 12,
  },
  entryBody: {
    flex: 1,
    paddingBottom: 16,
  },
  entryBodyLast: {
    paddingBottom: 0,
  },
  entryTitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
    color: BLACK,
  },
  entryPeriod: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.2,
    fontWeight: "300",
    color: GRAY.DARK,
  },
  listItem: {
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: GRAY.DARK,
  },
});

export default styles;
