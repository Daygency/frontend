import { useEffect } from "react";
import type { ReactNode } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SWOOSH_DURATION_MS = 220;
const SWOOSH_DISTANCE = 28;

type Props = {
  children: ReactNode;
  /** true인 경우에만 등장 애니메이션 재생 (과거 메시지 로드 시에는 즉시 표시) */
  shouldAnimate: boolean;
};

const AnimatedMessageRow = ({ children, shouldAnimate }: Props) => {
  const progress = useSharedValue(shouldAnimate ? 0 : 1);

  useEffect(() => {
    if (shouldAnimate) {
      progress.value = withTiming(1, {
        duration: SWOOSH_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    }
    // 최초 마운트에만 재생 — 이후 리렌더(읽음 표시 등)에서는 다시 실행하지 않음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = (1 - progress.value) * SWOOSH_DISTANCE;
    return {
      opacity: progress.value,
      transform: [{ translateY: offset }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default AnimatedMessageRow;
