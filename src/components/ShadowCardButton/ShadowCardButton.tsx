import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";
import React from "react";

interface Styles {
  container: StyleProp<ViewStyle>;
}

type ShadowCardButtonProp = {
  children: React.ReactNode;
  styles?: Styles;
};

const ShadowCardButton = ({ children, styles }: ShadowCardButtonProp) => {
  return (
    <Pressable
      style={[defaultStyles.container, defaultStyles.shadow, styles?.container]}
    >
      {children}
    </Pressable>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  shadow: {
    shadowColor: MAIN.DEFAULT,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
});

export default ShadowCardButton;
