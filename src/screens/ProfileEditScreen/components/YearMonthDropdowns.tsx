import React from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import styles from "../styles";

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, "0");
  return { label: `${i + 1}월`, value };
});

const YEAR_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const value = String(CURRENT_YEAR - i);
  return { label: `${value}년`, value };
});

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
}: Props) => (
  <View style={styles.dateFieldGroup}>
    {label ? <Text style={styles.dateFieldLabel}>{label}</Text> : null}
    <View style={styles.dateDropdownRow}>
      <View style={[styles.dateDropdownWrap, disabled && styles.dateDropdownDisabled]}>
        <Dropdown
          style={styles.dateDropdown}
          placeholderStyle={styles.dateDropdownPlaceholder}
          selectedTextStyle={styles.dateDropdownText}
          itemTextStyle={styles.dateDropdownItemText}
          containerStyle={styles.dateDropdownContainer}
          iconStyle={styles.dateDropdownIcon}
          data={MONTH_OPTIONS}
          search={false}
          maxHeight={260}
          labelField="label"
          valueField="value"
          placeholder="월"
          value={month || null}
          disable={disabled}
          onChange={(item) => onChange(year, item.value)}
        />
      </View>
      <View style={[styles.dateDropdownWrap, disabled && styles.dateDropdownDisabled]}>
        <Dropdown
          style={styles.dateDropdown}
          placeholderStyle={styles.dateDropdownPlaceholder}
          selectedTextStyle={styles.dateDropdownText}
          itemTextStyle={styles.dateDropdownItemText}
          containerStyle={styles.dateDropdownContainer}
          iconStyle={styles.dateDropdownIcon}
          data={YEAR_OPTIONS}
          search={false}
          maxHeight={260}
          labelField="label"
          valueField="value"
          placeholder="년"
          value={year || null}
          disable={disabled}
          onChange={(item) => onChange(item.value, month)}
        />
      </View>
    </View>
  </View>
);

export default YearMonthDropdowns;
