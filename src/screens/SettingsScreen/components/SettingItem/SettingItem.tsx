import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShadowCardButton from "../../../../components/cards/ShadowCardButton";
import styles from "./styles";
import { BLACK, GRAY } from "../../../../color";

interface SettingItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  color?: string;
}

const SettingItem = ({
  icon,
  label,
  onPress,
  isLast,
  color = BLACK,
}: SettingItemProps) => {
  return (
    <ShadowCardButton
      onPress={onPress}
      styles={{
        container: [styles.itemContainer, isLast && styles.lastItem],
      }}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={GRAY.DARK_1} />
      </View>
    </ShadowCardButton>
  );
};

export default SettingItem;
