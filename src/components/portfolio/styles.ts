import { StyleSheet } from "react-native";
import { WHITE } from "../../color";
import {
  PORTFOLIO_BODY_BG,
  PORTFOLIO_IMMERSIVE_BG,
  PORTFOLIO_SECTION_GAP,
} from "../../constants/portfolio";

export { PORTFOLIO_BODY_BG, PORTFOLIO_IMMERSIVE_BG, PORTFOLIO_SECTION_GAP };

export const portfolioSectionStyles = {
  container: {
    marginBottom: 0,
  },
  header: {
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  content: {
    paddingHorizontal: 0,
    marginTop: 0,
    gap: 0,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  containerImmersive: {
    backgroundColor: PORTFOLIO_IMMERSIVE_BG,
  },
  scroll: {
    flex: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: PORTFOLIO_BODY_BG,
    paddingBottom: 24,
  },
  contentSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
});

export default styles;
