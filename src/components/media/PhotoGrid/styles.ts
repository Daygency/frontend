import { StyleSheet } from "react-native";
import { GRAY, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

/** 타일 사이 간격 — 각 타일에 padding으로 둘러 균일한 여백을 만든다 */
const GAP = 3;

const styles = themedStyles(() => ({
  container: {
    marginTop: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  tile: {
    padding: GAP,
  },
  tileInner: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    overflow: "hidden",
    backgroundColor: GRAY.DEFAULT,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  tileOverlayText: {
    fontSize: 20,
    fontWeight: "700",
    color: FIXED_WHITE,
  },
  /** 1장: 꽉 찬 정사각형 */
  full: {
    width: "100%",
    aspectRatio: 1,
  },
  /** 2장/4장: 나란히 반반 정사각형 */
  half: {
    flex: 1,
    aspectRatio: 1,
  },
  /** 3장 이상: 왼쪽 큰 사진 (오른쪽 두 장을 쌓은 높이와 맞춰짐) */
  twoThirds: {
    flex: 2,
    aspectRatio: 1,
  },
  /** 3장: 오른쪽 두 장을 담는 좁은 세로 컬럼 */
  oneThirdColumn: {
    flex: 1,
  },
  /** 3장 이상: 오른쪽 컬럼 안의 타일 — flex:1 두 개가 컬럼 높이(왼쪽 큰 사진과 동일)를 정확히 반씩 나눠 가짐 */
  rightTile: {
    flex: 1,
  },
}));

export default styles;
