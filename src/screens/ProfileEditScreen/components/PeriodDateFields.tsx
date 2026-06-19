import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../../color";
import YearMonthDropdowns from "./YearMonthDropdowns";
import styles from "../styles";

type Props = {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isOngoing: boolean;
  onChangeStart: (year: string, month: string) => void;
  onChangeEnd: (year: string, month: string) => void;
  onChangeOngoing: (value: boolean) => void;
  currentLabel: string;
};

const PeriodDateFields = ({
  startYear,
  startMonth,
  endYear,
  endMonth,
  isOngoing,
  onChangeStart,
  onChangeEnd,
  onChangeOngoing,
  currentLabel,
}: Props) => {
  const handleEndChange = (year: string, month: string) => {
    onChangeEnd(year, month);
  };

  const toggleCurrent = () => {
    onChangeOngoing(!isOngoing);
  };

  return (
    <View style={styles.periodFields}>
      <YearMonthDropdowns
        label="시작일"
        year={startYear}
        month={startMonth}
        onChange={onChangeStart}
      />
      <YearMonthDropdowns
        label="종료일"
        year={endYear}
        month={endMonth}
        onChange={handleEndChange}
        disabled={isOngoing}
      />
      <Pressable style={styles.currentToggleRow} onPress={toggleCurrent}>
        <MaterialCommunityIcons
          name={isOngoing ? "checkbox-marked" : "checkbox-blank-outline"}
          size={22}
          color={isOngoing ? MAIN.DEFAULT : GRAY.DARK_2}
        />
        <Text style={styles.currentToggleText}>{currentLabel}</Text>
      </Pressable>
    </View>
  );
};

export default PeriodDateFields;
