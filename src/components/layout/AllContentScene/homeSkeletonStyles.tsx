import { Dimensions } from "react-native";
import { GRAY, SKELETON, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const { width: screenWidth } = Dimensions.get("window");

const HERO_CONTAINER_HEIGHT = 250;
const HERO_CARD_WIDTH = screenWidth * 0.9;
const NEWS_CARD_WIDTH = 138;
const NEWS_CARD_IMAGE_HEIGHT = 193;
const NEWS_CARD_GAP = 14;

const homeSkeletonStyles = themedStyles(() => ({
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
  announcementCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: GRAY.MEDIUM,
    overflow: "hidden",
  },
  announcementTopSection: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
  },
  announcementProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  announcementAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  announcementAuthorName: {
    width: 70,
    height: 18,
    marginRight: 8,
  },
  announcementDDay: {
    width: 36,
    height: 18,
    marginLeft: "auto",
  },
  announcementTitle: {
    width: "70%",
    height: 20,
  },
  announcementFooterSection: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: GRAY.DEFAULT_1,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
  },
  announcementTag: {
    width: 56,
    height: 18,
    borderRadius: 4,
  },
  communityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM_2,
  },
  communityBoardName: {
    width: 60,
    height: 18,
    marginRight: 12,
  },
  communityLatestPost: {
    flex: 1,
    height: 16,
  },
}));

export default homeSkeletonStyles;
