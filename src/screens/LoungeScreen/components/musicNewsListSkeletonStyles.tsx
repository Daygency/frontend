import { GRAY, SKELETON, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

const POSTER_WIDTH = 112;
const POSTER_HEIGHT = 150;

const skeletonStyles = themedStyles(() => ({
  box: {
    borderRadius: 5,
  },
  boxDark: {
    backgroundColor: SKELETON.DARK,
  },
  boxLight: {
    backgroundColor: SKELETON.LIGHT,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: WHITE,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  titleLine: {
    width: "90%",
    height: 20,
  },
  titleLine2: {
    marginTop: 6,
    width: "55%",
    height: 20,
  },
  timeLine: {
    marginTop: 10,
    width: "45%",
    height: 17,
  },
  placeLine: {
    marginTop: 8,
    width: "65%",
    height: 16,
  },
  priceLine: {
    marginTop: 8,
    width: "35%",
    height: 14,
  },
  separator: {
    height: 1,
    backgroundColor: GRAY.MEDIUM,
    marginLeft: 16 + POSTER_WIDTH + 14,
  },
}));

export default skeletonStyles;
