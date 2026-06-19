import React, { useState } from "react";
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
  onChangeStart: (year: string, month: string) => void;
  onChangeEnd: (year: string, month: string) => void;
  currentLabel: string;
};

const PeriodDateFields = ({
  startYear,
  startMonth,
  endYear,
  endMonth,
  onChangeStart,
  onChangeEnd,
  currentLabel,
}: Props) => {
  const [isCurrent, setIsCurrent] = useState(
    () => !endYear && !endMonth && !!(startYear && startMonth),
  );

  const handleEndChange = (year: string, month: string) => {
    if (year || month) {
      setIsCurrent(false);
    }
    onChangeEnd(year, month);
  };

  const toggleCurrent = () => {
    const next = !isCurrent;
    setIsCurrent(next);
    if (next) {
      onChangeEnd("", "");
    }
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
        disabled={isCurrent}
      />
      <Pressable style={styles.currentToggleRow} onPress={toggleCurrent}>
        <MaterialCommunityIcons
          name={isCurrent ? "checkbox-marked" : "checkbox-blank-outline"}
          size={22}
          color={isCurrent ? MAIN.DEFAULT : GRAY.DARK_2}
        />
        <Text style={styles.currentToggleText}>{currentLabel}</Text>
      </Pressable>
    </View>
  );
};

export default PeriodDateFields;
