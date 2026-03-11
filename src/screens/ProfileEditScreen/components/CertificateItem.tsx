import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { GRAY, MAIN } from "../../../color";
import type { CertificateEntry } from "../../../lib/profileApi";
import DatePickerField from "./DatePickerField";
import styles from "../styles";

type Props = {
  entry: CertificateEntry;
  onChange: (updates: Partial<CertificateEntry>) => void;
  onDelete: () => void;
};

const CertificateItem = ({ entry, onChange, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(!entry.description);
  const [isFocused, setIsFocused] = useState(false);

  const date =
    entry.year && entry.month
      ? `취득 ${entry.year}.${entry.month.padStart(2, "0")}`
      : entry.year ? `취득 ${entry.year}` : "";

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onChange({ fileUri: asset.uri, fileName: asset.name });
      }
    } catch {
      Alert.alert("오류", "파일을 선택하는 중 오류가 발생했습니다.");
    }
  };

  if (!isEditing) {
    return (
      <View style={styles.entryCompactCard}>
        <View style={styles.entryCompactInfo}>
          <Text style={styles.entryCompactDescription} numberOfLines={2}>
            {entry.description || "(내용 없음)"}
          </Text>
          {date ? (
            <Text style={styles.entryCompactPeriod}>{date}</Text>
          ) : null}
          {entry.fileName ? (
            <Text
              style={[styles.entryCompactPeriod, { color: MAIN.DEFAULT }]}
              numberOfLines={1}
            >
              📎 {entry.fileName}
            </Text>
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
        placeholder="자격증명, 발급기관 등을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={2}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <DatePickerField
        label="취득시점"
        year={entry.year}
        month={entry.month}
        pickerTitle="취득 년월"
        onConfirm={(y, m) => onChange({ year: y, month: m })}
      />
      <Pressable style={styles.filePickerButton} onPress={handlePickFile}>
        <MaterialCommunityIcons name="paperclip" size={16} color={MAIN.DEFAULT} />
        <Text style={styles.filePickerText} numberOfLines={1}>
          {entry.fileName ? entry.fileName : "증명서 파일 첨부"}
        </Text>
      </Pressable>
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

export default CertificateItem;
