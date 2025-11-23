import { TextInput } from "react-native";
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
    <ShadowCardButton>
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
