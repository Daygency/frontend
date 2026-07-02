import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WheelDateTimePickerModal from "../../../components/modals/WheelDateTimePickerModal";
import { GRAY } from "../../../color";
import { formatYearMonth } from "../../../lib/profile/profileEntryDates";
import styles from "../styles";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_DATE = new Date(CURRENT_YEAR - 59, 0, 1);
const MAX_DATE = new Date(CURRENT_YEAR, 11, 31);

function yearMonthToDate(year: string, month: string): Date {
  if (year && month) {
    const y = Number(year);
    const m = Number(month) - 1;
    if (Number.isFinite(y) && Number.isFinite(m) && m >= 0 && m <= 11) {
      return new Date(y, m, 1);
    }
  }
  return new Date(CURRENT_YEAR, new Date().getMonth(), 1);
}

type Props = {
  label?: string;
  year: string;
  month: string;
  onChange: (year: string, month: string) => void;
  disabled?: boolean;
};

const YearMonthDropdowns = ({
  label,
  year,
  month,
  onChange,
  disabled = false,
}: Props) => {
  const [visible, setVisible] = useState(false);
  const value = useMemo(() => yearMonthToDate(year, month), [year, month]);
  const display = formatYearMonth(year, month);
  const pickerTitle = label ? `${label} 선택` : "년월 선택";

  return (
    <View style={styles.dateFieldGroup}>
      {label ? <Text style={styles.dateFieldLabel}>{label}</Text> : null}
      <Pressable
        style={[
          styles.datePickerField,
          disabled && styles.datePickerFieldDisabled,
        ]}
        onPress={() => setVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.datePickerFieldText,
            !display && styles.datePickerFieldTextPlaceholder,
          ]}
        >
          {display || "년월 선택"}
        </Text>
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={disabled ? GRAY.DARK_2 : GRAY.DARK_1}
        />
      </Pressable>

      <WheelDateTimePickerModal
        visible={visible}
        value={value}
        pickerMode="date"
        title={pickerTitle}
        description={
          label ? `${label}을(를) 선택하세요.` : "년월을 선택하세요."
        }
        minimumDate={MIN_DATE}
        maximumDate={MAX_DATE}
        confirmLabel={(date) => {
          const y = date.getFullYear();
          const m = date.getMonth() + 1;
          return `${y}년 ${m}월 선택`;
        }}
        onConfirm={(selected) => {
          onChange(
            String(selected.getFullYear()),
            String(selected.getMonth() + 1).padStart(2, "0"),
          );
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
};

export default YearMonthDropdowns;
