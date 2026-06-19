import React from "react";
import YearMonthDropdowns from "./YearMonthDropdowns";

type Props = {
  label: string;
  year: string;
  month: string;
  pickerTitle?: string;
  onConfirm: (year: string, month: string) => void;
};

const DatePickerField = ({ label, year, month, onConfirm }: Props) => (
  <YearMonthDropdowns
    label={label}
    year={year}
    month={month}
    onChange={onConfirm}
  />
);

export default DatePickerField;
