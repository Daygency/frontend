import React from "react";
import { Switch, Text, View } from "react-native";
import styles from "./styles";
import { GRAY, MAIN } from "../../../color";

export interface ShadowCardListToggleItemProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
  /** true면 스위치 비활성 (예: 네이티브 모듈 없음) */
  disabled?: boolean;
}

const ShadowCardListToggleItem = ({
  label,
  description,
  value,
  onValueChange,
  isLast,
  disabled = false,
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
        disabled={disabled}
        trackColor={{ true: MAIN.DEFAULT, false: GRAY.MEDIUM }}
        thumbColor="#fff"
      />
    </View>
  );
};

export default ShadowCardListToggleItem;
