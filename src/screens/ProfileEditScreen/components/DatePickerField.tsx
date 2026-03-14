import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../../color";
import YearMonthPicker from "../../../components/YearMonthPicker/YearMonthPicker";
import styles from "../styles";

type Props = {
  label: string;
  year: string;
  month: string;
  pickerTitle?: string;
  onConfirm: (year: string, month: string) => void;
};

const formatDate = (year: string, month: string): string => {
  if (!year && !month) return "날짜 선택";
  if (year && month) return `${year}년 ${parseInt(month, 10)}월`;
  if (year) return `${year}년`;
  return `${parseInt(month, 10)}월`;
};

const DatePickerField = ({
  label,
  year,
  month,
  pickerTitle,
  onConfirm,
}: Props) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const hasValue = !!year || !!month;

  return (
    <View style={styles.ymRow}>
      <Text style={styles.ymLabel}>{label}</Text>
      <Pressable
        style={[styles.datePickerButton, hasValue && styles.datePickerButtonFilled]}
        onPress={() => setPickerVisible(true)}
      >
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={15}
          color={hasValue ? MAIN.DEFAULT : GRAY.DARK_2}
        />
        <Text
          style={[
            styles.datePickerText,
            hasValue && styles.datePickerTextFilled,
          ]}
        >
          {formatDate(year, month)}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={15}
          color={hasValue ? MAIN.DEFAULT : GRAY.DARK_2}
        />
      </Pressable>

      <YearMonthPicker
        visible={pickerVisible}
        value={{ year, month }}
        onConfirm={(y, m) => {
          onConfirm(y, m);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
        title={pickerTitle ?? label}
      />
    </View>
  );
};

export default DatePickerField;
