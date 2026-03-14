import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../color";
import styles from "./styles";

const MONTHS = [
  "1월", "2월", "3월", "4월",
  "5월", "6월", "7월", "8월",
  "9월", "10월", "11월", "12월",
];

const CURRENT_YEAR = new Date().getFullYear();

type Props = {
  visible: boolean;
  /** 현재 값. year/month가 빈 문자열이면 미설정 상태 */
  value: { year: string; month: string };
  onConfirm: (year: string, month: string) => void;
  onClose: () => void;
  title?: string;
};

const YearMonthPicker = ({
  visible,
  value,
  onConfirm,
  onClose,
  title = "날짜 선택",
}: Props) => {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedYear(value.year ? parseInt(value.year, 10) : CURRENT_YEAR);
      setSelectedMonth(value.month ? parseInt(value.month, 10) : null);
    }
  }, [visible, value.year, value.month]);

  const handleConfirm = () => {
    if (selectedMonth === null) return;
    onConfirm(
      String(selectedYear),
      String(selectedMonth).padStart(2, "0")
    );
  };

  const handleClear = () => {
    onConfirm("", "");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={20} color={GRAY.DARK} />
            </Pressable>
          </View>

          {/* 년도 선택 */}
          <View style={styles.yearRow}>
            <Pressable
              onPress={() => setSelectedYear((y) => y - 1)}
              hitSlop={8}
              style={styles.yearArrow}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={MAIN.DEFAULT}
              />
            </Pressable>
            <Text style={styles.yearText}>{selectedYear}년</Text>
            <Pressable
              onPress={() => setSelectedYear((y) => y + 1)}
              hitSlop={8}
              style={styles.yearArrow}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color={MAIN.DEFAULT}
              />
            </Pressable>
          </View>

          {/* 월 그리드 */}
          <View style={styles.monthGrid}>
            {MONTHS.map((label, i) => {
              const monthNum = i + 1;
              const isSelected = selectedMonth === monthNum;
              return (
                <Pressable
                  key={monthNum}
                  style={[
                    styles.monthButton,
                    isSelected && styles.monthButtonSelected,
                  ]}
                  onPress={() => setSelectedMonth(monthNum)}
                >
                  <Text
                    style={[
                      styles.monthText,
                      isSelected && styles.monthTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <Pressable style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearText}>초기화</Text>
            </Pressable>
            <Pressable
              style={[
                styles.confirmButton,
                selectedMonth === null && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={selectedMonth === null}
            >
              <Text style={styles.confirmText}>확인</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default YearMonthPicker;
