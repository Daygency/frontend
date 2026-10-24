import { WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";
import {
  portfolioBodyBg,
  portfolioImmersiveBg,
  PORTFOLIO_SECTION_GAP,
} from "../../constants/portfolio";

export { portfolioBodyBg, portfolioImmersiveBg, PORTFOLIO_SECTION_GAP };

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

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  containerImmersive: {
    backgroundColor: portfolioImmersiveBg(),
  },
  scroll: {
    flex: 1,
    backgroundColor: portfolioBodyBg(),
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: portfolioBodyBg(),
    paddingBottom: 24,
  },
  contentSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: PORTFOLIO_SECTION_GAP,
  },
}));

export default styles;
