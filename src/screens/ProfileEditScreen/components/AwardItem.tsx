import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, findNodeHandle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import type { AwardEntry } from "../../../lib/apis/portfolio/types";
import DatePickerField from "./DatePickerField";
import { formatYearMonth } from "./profileEntryUtils";
import styles from "../styles";

type Props = {
  entry: AwardEntry;
  onChange: (updates: Partial<AwardEntry>) => void;
  onDelete: () => void;
  onEditingFocusChange?: (
    focused: boolean,
    inputNode?: number | null,
    actionRowNode?: number | null,
  ) => void;
};

const AwardItem = ({
  entry,
  onChange,
  onDelete,
  onEditingFocusChange,
}: Props) => {
  const [isEditing, setIsEditing] = useState(!entry.description);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const actionRowRef = useRef<View>(null);

  const date = formatYearMonth(entry.year, entry.month);
  const isDraftEntry =
    !entry.description.trim() && !entry.year && !entry.month;

  const handleCancel = () => {
    if (isDraftEntry) {
      onDelete();
      return;
    }
    setIsEditing(false);
  };

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
              size={18}
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
              size={18}
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
        ]}
        value={entry.description}
        onChangeText={(v) => onChange({ description: v })}
        placeholder="수상명, 주최기관 등 수상 내용을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={2}
        autoFocus={isEditing && !entry.description.trim()}
        onFocus={() => {
          setIsFocused(true);
          onEditingFocusChange?.(
            true,
            findNodeHandle(inputRef.current),
            findNodeHandle(actionRowRef.current),
          );
        }}
        onBlur={() => {
          setIsFocused(false);
          onEditingFocusChange?.(false);
        }}
        ref={inputRef}
      />
      <DatePickerField
        label="수상 시기"
        year={entry.year}
        month={entry.month}
        onConfirm={(y, m) => onChange({ year: y, month: m })}
      />
      <View style={styles.entryButtonRow} ref={actionRowRef}>
        <Pressable style={styles.entryCancelButton} onPress={handleCancel}>
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
