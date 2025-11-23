import { Foundation } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { RED } from "../../color";
import styles from "./styles";

type FormProps = {
  isRequired: boolean;
  title: string;
  example?: string;
  children: ReactNode;
};

const Form = ({ isRequired, title, example, children }: FormProps) => {
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
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

export default Form;

