import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * 채팅 말풍선(가장 좁은 경우: 상대방 메시지, 아바타 여백 40px, 60% maxWidth)보다
 * 미디어 콘텐츠가 커지지 않도록 잡아주는 상한. 고정 픽셀(220)만 쓰면 화면이 좁은
 * 기기에서 사진/그리드가 말풍선 밖으로 삐져나오는 문제가 있었다.
 */
export const MEDIA_MAX_WIDTH = Math.max(
  120,
  Math.min(220, Math.floor((SCREEN_WIDTH - 72) * 0.6) - 8),
);
