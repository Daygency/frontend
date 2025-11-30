import { Platform, TextInput } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

type FormTextInputProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

const FormTextInput = ({
  placeholder,
  value,
  onChangeText,
}: FormTextInputProps) => {
  return (
    <ShadowCardButton
      styles={{
        container: {
          borderRadius: 12,
          paddingVertical: Platform.OS === "ios" ? 15 : 1,
          height: Platform.OS === "ios" ? 46 : 46,
        },
      }}
    >
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </ShadowCardButton>
  );
};

export default FormTextInput;
