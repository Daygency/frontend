import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, findNodeHandle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import type { CareerEntry } from "../../../lib/apis/portfolio/types";
import PeriodDateFields from "./PeriodDateFields";
import { formatPeriod } from "./profileEntryUtils";
import styles from "../styles";

type Props = {
  entry: CareerEntry;
  onChange: (updates: Partial<CareerEntry>) => void;
  onDelete: () => void;
  onEditingFocusChange?: (
    focused: boolean,
    inputNode?: number | null,
    actionRowNode?: number | null,
  ) => void;
};

const CareerItem = ({
  entry,
  onChange,
  onDelete,
  onEditingFocusChange,
}: Props) => {
  const [isEditing, setIsEditing] = useState(!entry.description);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const actionRowRef = useRef<View>(null);

  const period = formatPeriod(
    entry.startYear,
    entry.startMonth,
    entry.endYear,
    entry.endMonth,
    { isOngoing: entry.isOngoing, ongoingLabel: "재직 중" },
  );
  const isDraftEntry =
    !entry.careerId &&
    !entry.description.trim() &&
    !entry.startYear &&
    !entry.startMonth &&
    !entry.endYear &&
    !entry.endMonth &&
    !entry.isOngoing;

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
          {period ? (
            <Text style={styles.entryCompactPeriod}>{period}</Text>
          ) : null}
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
        placeholder="회사명, 직무, 역할 등 경력을 입력하세요"
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
      <PeriodDateFields
        startYear={entry.startYear}
        startMonth={entry.startMonth}
        endYear={entry.endYear}
        endMonth={entry.endMonth}
        isOngoing={entry.isOngoing ?? false}
        onChangeStart={(y, m) => onChange({ startYear: y, startMonth: m })}
        onChangeEnd={(y, m) =>
          onChange({
            endYear: y,
            endMonth: m,
            ...(y || m ? { isOngoing: false } : {}),
          })
        }
        onChangeOngoing={(value) =>
          onChange(
            value
              ? { isOngoing: true, endYear: "", endMonth: "" }
              : { isOngoing: false },
          )
        }
        currentLabel="현재 재직 중"
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

export default CareerItem;
