import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import type { EducationEntry } from "../../../lib/apis/portfolio/profileApi";
import DatePickerField from "./DatePickerField";
import styles from "../styles";

type Props = {
  entry: EducationEntry;
  onChange: (updates: Partial<EducationEntry>) => void;
  onDelete: () => void;
};

const formatPeriod = (
  sY: string,
  sM: string,
  eY: string,
  eM: string,
): string => {
  const fmt = (y: string, m: string) =>
    y && m ? `${y}.${m.padStart(2, "0")}` : y || "";
  const start = fmt(sY, sM);
  const end = fmt(eY, eM);
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} ~ ${end}`;
};

const EducationItem = ({ entry, onChange, onDelete }: Props) => {
  // 내용이 없으면 바로 편집 모드로 열림
  const [isEditing, setIsEditing] = useState(!entry.description);
  const [isFocused, setIsFocused] = useState(false);

  const period = formatPeriod(
    entry.startYear,
    entry.startMonth,
    entry.endYear,
    entry.endMonth,
  );

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
        placeholder="학교명, 전공, 학위 등 학력을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={2}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <DatePickerField
        label="시작"
        year={entry.startYear}
        month={entry.startMonth}
        pickerTitle="시작 년월"
        onConfirm={(y, m) => onChange({ startYear: y, startMonth: m })}
      />
      <DatePickerField
        label="종료"
        year={entry.endYear}
        month={entry.endMonth}
        pickerTitle="종료 년월"
        onConfirm={(y, m) => onChange({ endYear: y, endMonth: m })}
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

export default EducationItem;
