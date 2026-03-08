import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import defaultStyles from "./styles";

interface ShadowCardListProps {
  children: React.ReactNode;
  styles?: { container?: StyleProp<ViewStyle> };
}

const ShadowCardList = ({ children, styles: customStyles }: ShadowCardListProps) => {
  return (
    <View
      style={[
        defaultStyles.container,
        defaultStyles.shadow,
        customStyles?.container,
      ]}
    >
      {children}
    </View>
  );
};

export default ShadowCardList;
export { default as ShadowCardListItem } from "./ShadowCardListItem";
export { default as ShadowCardListToggleItem } from "./ShadowCardListToggleItem";
