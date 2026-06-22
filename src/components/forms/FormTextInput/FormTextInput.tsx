import { Platform, TextInput, View, type TextInputProps } from "react-native";
import { GRAY } from "../../../color";
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
    <View style={[styles.field, hasError && styles.fieldError]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={GRAY.MEDIUM_100}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
        textAlignVertical="center"
        {...Platform.select({
          android: { includeFontPadding: false },
          web: { cursor: "text" },
        })}
      />
    </View>
  );
};

export default FormTextInput;
