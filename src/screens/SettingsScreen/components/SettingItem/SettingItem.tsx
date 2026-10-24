import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { BLACK, GRAY } from "../../../../color";

interface SettingItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  color?: string;
  /** 오른쪽에 표시할 현재 값 (예: 화면 모드) */
  value?: string;
}

const SettingItem = ({
  icon,
  label,
  onPress,
  isLast,
  color = BLACK,
  value,
}: SettingItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.itemContainer, isLast && styles.lastItem]}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <MaterialCommunityIcons name={icon} size={21} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
        <View style={styles.rightContent}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          <MaterialCommunityIcons
            name="chevron-right"
            size={21}
            color={GRAY.DARK_1}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default SettingItem;
