import { Platform, TextInput, type TextInputProps } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

type FormTextInputProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  hasError?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
};

const FormTextInput = ({
  placeholder,
  value,
  onChangeText,
  hasError,
  keyboardType,
}: FormTextInputProps) => {
  return (
    <ShadowCardButton
      styles={{
        container: {
          borderRadius: 12,
          paddingVertical: Platform.OS === "ios" ? 15 : 1,
          height: Platform.OS === "ios" ? 46 : 46,
          ...(hasError && { borderWidth: 2, borderColor: "#EC1313" }),
        },
      }}
    >
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </ShadowCardButton>
  );
};

export default FormTextInput;
