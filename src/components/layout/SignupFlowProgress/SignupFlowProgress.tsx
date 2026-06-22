import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";
import { MAIN, GRAY } from "../../../color";
import { styles } from "./styles";

type SignupFlowProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

const AnimatedDot = ({
  index,
  currentStep,
}: {
  index: number;
  currentStep: number;
}) => {
  const isActive = index + 1 === currentStep;
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      [GRAY.MEDIUM_2, MAIN.DEFAULT]
    ),
    transform: [{ scale: 1 + activeProgress.value * 0.25 }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const SignupFlowProgress = ({
  currentStep,
  totalSteps = 2,
}: SignupFlowProgressProps) => (
  <View style={styles.container}>
    <View style={styles.dotsRow}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <AnimatedDot key={i} index={i} currentStep={currentStep} />
      ))}
    </View>
  </View>
);

export default SignupFlowProgress;
