import {
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import defaultStyles from "./styles";

interface Styles {
  container: StyleProp<ViewStyle>;
}

type ShadowCardButtonProp = {
  children: React.ReactNode;
  styles?: Styles;
  onPress?: () => void;
};

const ShadowCardButton = ({ children, styles, onPress }: ShadowCardButtonProp) => {
  return (
    <Pressable
      style={[defaultStyles.container, defaultStyles.shadow, styles?.container]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default ShadowCardButton;
