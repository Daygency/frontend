import { Dimensions, StyleSheet } from "react-native";
import { SKELETON } from "../../../color";

const { width: screenWidth } = Dimensions.get("window");

const HERO_CONTAINER_HEIGHT = 250;
const HERO_CARD_WIDTH = screenWidth * 0.9;
const NEWS_CARD_WIDTH = 138;
const NEWS_CARD_IMAGE_HEIGHT = 193;
const NEWS_CARD_GAP = 14;

const homeSkeletonStyles = StyleSheet.create({
  box: {
    borderRadius: 5,
  },
  boxDark: {
    backgroundColor: SKELETON.DARK,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  hero: {
    height: HERO_CONTAINER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    width: HERO_CARD_WIDTH,
    height: HERO_CONTAINER_HEIGHT,
    borderRadius: 16,
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 6,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 18,
  },
  pillApplied: {
    width: 92,
    height: 36,
    borderRadius: 18,
  },
  pillPosted: {
    width: 112,
    height: 36,
    borderRadius: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    width: 70,
    height: 20,
  },
  newsRow: {
    flexDirection: "row",
    gap: NEWS_CARD_GAP,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  newsCard: {
    width: NEWS_CARD_WIDTH,
  },
  newsImage: {
    width: NEWS_CARD_WIDTH,
    height: NEWS_CARD_IMAGE_HEIGHT,
    borderRadius: 10,
  },
  newsTitleLine: {
    marginTop: 8,
    width: "90%",
    height: 14,
  },
  newsTitleLine2: {
    marginTop: 6,
    width: "60%",
    height: 14,
  },
  newsPlaceLine: {
    marginTop: 8,
    width: "70%",
    height: 11,
  },
  newsDateLine: {
    marginTop: 6,
    width: "50%",
    height: 11,
  },
});

export default homeSkeletonStyles;
