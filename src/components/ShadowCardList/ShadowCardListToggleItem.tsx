import React from "react";
import { Switch, Text, View } from "react-native";
import styles from "./styles";
import { GRAY } from "../../color";

export interface ShadowCardListToggleItemProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}

const ShadowCardListToggleItem = ({
  label,
  description,
  value,
  onValueChange,
  isLast,
}: ShadowCardListToggleItemProps) => {
  return (
    <View style={[styles.item, isLast && styles.itemLast]}>
      <View style={styles.toggleItemContent}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && (
          <Text style={styles.toggleDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: GRAY.DEFAULT_1, false: GRAY.MEDIUM }}
        thumbColor="#fff"
      />
    </View>
  );
};

export default ShadowCardListToggleItem;
