import { Foundation } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";
import styles from "./styles";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { RED } from "../../color";

type FormInputProps = {
  isRequired: boolean;
  title: string;
  placeholder: string;
  example?: string;
};

const FormInput = ({
  isRequired,
  title,
  placeholder,
  example,
}: FormInputProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {isRequired && (
          <Foundation
            name="asterisk"
            size={10}
            color={RED.DARK}
            style={styles.asterisk}
          />
        )}
      </View>
      {example && <Text style={styles.example}>{example}</Text>}
      <ShadowCardButton styles={{ container: { marginTop: 8 } }}>
        <TextInput placeholder={placeholder} style={styles.input} />
      </ShadowCardButton>
    </View>
  );
};
export default FormInput;
