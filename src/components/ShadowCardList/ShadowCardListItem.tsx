import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { GRAY } from "../../color";

export interface ShadowCardListItemProps {
  label: string;
  value: string;
  onPress?: () => void;
  isLast?: boolean;
  valueColor?: string;
}

const ShadowCardListItem = ({
  label,
  value,
  onPress,
  isLast,
  valueColor,
}: ShadowCardListItemProps) => {
  const content = (
    <View style={[styles.item, isLast && styles.itemLast]}>
      <View style={styles.itemContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueColor && { color: valueColor }]}>
          {value}
        </Text>
      </View>
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={GRAY.DARK_1}
          style={styles.chevron}
        />
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};

export default ShadowCardListItem;
