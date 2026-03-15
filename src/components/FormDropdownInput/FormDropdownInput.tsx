import { Dropdown } from "react-native-element-dropdown";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

type DropdownItem = {
  label: string;
  value: string;
};

type FormDropdownInputProps = {
  placeholder: string;
  data: DropdownItem[];
  value?: string;
  onChange?: (item: DropdownItem) => void;
  hasError?: boolean;
};

const FormDropdownInput = ({
  placeholder,
  data,
  value,
  onChange,
  hasError,
}: FormDropdownInputProps) => {
  return (
    <ShadowCardButton
      styles={{
        container: hasError ? { borderWidth: 2, borderColor: "#EC1313" } : undefined,
      }}
    >
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.containerStyle}
        data={data}
        search={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => onChange?.(item as DropdownItem)}
        renderLeftIcon={() => null}
      />
    </ShadowCardButton>
  );
};

export default FormDropdownInput;

