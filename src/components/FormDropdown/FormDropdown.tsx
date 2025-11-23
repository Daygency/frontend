import { Foundation } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { RED } from "../../color";
import styles from "./styles";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";

type DropdownItem = {
  label: string;
  value: string;
};

type FormDropdownProps = {
  isRequired: boolean;
  title: string;
  placeholder: string;
  example?: string;
  data: DropdownItem[];
  value?: string;
  onChange?: (item: DropdownItem) => void;
};

const FormDropdown = ({
  isRequired,
  title,
  placeholder,
  example,
  data,
  value,
  onChange,
}: FormDropdownProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {isRequired && (
          <Foundation
            name="asterisk"
            size={10}
            color={RED}
            style={styles.asterisk}
          />
        )}
      </View>
      {example && <Text style={styles.example}>{example}</Text>}
      <ShadowCardButton styles={{ container: { marginTop: 8 } }}>
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
          onChange={onChange}
          renderLeftIcon={() => null}
        />
      </ShadowCardButton>
    </View>
  );
};

export default FormDropdown;

