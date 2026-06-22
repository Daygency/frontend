import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { GRAY } from "../../color";
import styles from "./styles";

type DropdownItem = {
  label: string;
  value: string;
};

type FormDropdownInputProps = {
  placeholder: string;
  data: DropdownItem[];
  value?: string | null;
  onChange?: (item: DropdownItem) => void;
  hasError?: boolean;
  disable?: boolean;
};

const FormDropdownInput = ({
  placeholder,
  data,
  value,
  onChange,
  hasError,
  disable,
}: FormDropdownInputProps) => {
  return (
    <View style={[styles.field, hasError && styles.fieldError]}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        selectedTextProps={{ numberOfLines: 1 }}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        data={data}
        search={false}
        maxHeight={300}
        mode="modal"
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value ?? null}
        disable={disable || data.length === 0}
        onChange={(item) => onChange?.(item as DropdownItem)}
        renderLeftIcon={() => null}
        renderRightIcon={() => (
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={GRAY.MEDIUM_100}
          />
        )}
        activeColor={GRAY.DEFAULT}
      />
    </View>
  );
};

export default FormDropdownInput;
