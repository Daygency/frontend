import { Foundation } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { RED } from "../../../color";
import styles from "./styles";

type FormTitleVariant = "default" | "section" | "sub";

type FormProps = {
  isRequired: boolean;
  title: string;
  example?: string;
  children?: ReactNode;
  hasError?: boolean;
  titleVariant?: FormTitleVariant;
};

const Form = ({
  isRequired,
  title,
  example,
  children,
  hasError,
  titleVariant = "default",
}: FormProps) => {
  const titleContainerStyle: StyleProp<ViewStyle> = [
    styles.titleContainer,
    titleVariant === "section" && styles.titleContainerSection,
    titleVariant === "sub" && styles.titleContainerSub,
  ];
  const titleStyle: StyleProp<TextStyle> = [
    styles.title,
    titleVariant === "section" && styles.titleSection,
    titleVariant === "sub" && styles.titleSub,
    hasError && styles.titleError,
  ];

  return (
    <View style={styles.container}>
      <View style={titleContainerStyle}>
        <Text style={titleStyle}>{title}</Text>
        {isRequired && (
          <Foundation
            name="asterisk"
            size={titleVariant === "section" ? 9 : 8}
            color={RED.DARK}
            style={styles.asterisk}
          />
        )}
      </View>
      {example && <Text style={styles.example}>{example}</Text>}
      {children != null ? (
        <View
          style={[
            styles.childrenContainer,
            titleVariant === "sub" && styles.childrenContainerSub,
          ]}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
};

export default Form;

