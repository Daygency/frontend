import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import type { AwardEntry } from "../../../lib/apis/portfolio/profileApi";
import DatePickerField from "./DatePickerField";
import styles from "../styles";

type Props = {
  entry: AwardEntry;
  onChange: (updates: Partial<AwardEntry>) => void;
  onDelete: () => void;
  onEditingFocusChange?: (focused: boolean) => void;
};

const AwardItem = ({
  entry,
  onChange,
  onDelete,
  onEditingFocusChange,
}: Props) => {
  const [isEditing, setIsEditing] = useState(!entry.description);
  const [isFocused, setIsFocused] = useState(false);

  const date =
    entry.year && entry.month
      ? `${entry.year}.${entry.month.padStart(2, "0")}`
      : entry.year || "";

  if (!isEditing) {
    return (
      <View style={styles.entryCompactCard}>
        <View style={styles.entryCompactInfo}>
          <Text style={styles.entryCompactDescription} numberOfLines={2}>
            {entry.description || "(내용 없음)"}
          </Text>
          {date ? <Text style={styles.entryCompactPeriod}>{date}</Text> : null}
        </View>
        <View style={styles.entryCompactActions}>
          <Pressable
            style={styles.entryCompactIconButton}
            onPress={() => setIsEditing(true)}
            hitSlop={4}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={16}
              color={GRAY.DARK}
            />
          </Pressable>
          <Pressable
            style={styles.entryCompactIconButton}
            onPress={onDelete}
            hitSlop={4}
          >
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={GRAY.DARK_2}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.entryCard}>
      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          isFocused && styles.inputFocused,
          { marginRight: 28 },
        ]}
        value={entry.description}
        onChangeText={(v) => onChange({ description: v })}
        placeholder="수상명, 주최기관 등 수상 내용을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={2}
        onFocus={() => {
          setIsFocused(true);
          onEditingFocusChange?.(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          onEditingFocusChange?.(false);
        }}
      />
      <DatePickerField
        label="수상시점"
        year={entry.year}
        month={entry.month}
        pickerTitle="수상 년월"
        onConfirm={(y, m) => onChange({ year: y, month: m })}
      />
      <View style={styles.entryButtonRow}>
        <Pressable
          style={styles.entryCancelButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.entryCancelButtonText}>취소</Text>
        </Pressable>
        <Pressable
          style={styles.entryCompleteButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.entryCompleteButtonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AwardItem;
