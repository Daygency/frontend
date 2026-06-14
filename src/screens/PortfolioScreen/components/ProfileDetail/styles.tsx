import { StyleSheet } from "react-native";
import { BLACK, GRAY, WHITE } from "../../../../color";
import {
  PORTFOLIO_BODY_BG,
  PORTFOLIO_SECTION_GAP,
} from "../../styles";

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
