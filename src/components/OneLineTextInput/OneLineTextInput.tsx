import React from "react";
import { Keyboard, TextInput, TextInputProps } from "react-native";
import styles from "./styles";

type Props = TextInputProps & {
  /**
   * 추가 스타일을 입힐 때 사용 (예: focus border)
   */
  style?: TextInputProps["style"];
};

const OneLineTextInput: React.FC<Props> = ({ style, ...rest }) => {
  return (
    <TextInput
      {...rest}
      style={[styles.input, style]}
      multiline={false}
      numberOfLines={1}
      returnKeyType={rest.returnKeyType ?? "done"}
      blurOnSubmit={rest.blurOnSubmit ?? true}
      onSubmitEditing={(e) => {
        rest.onSubmitEditing?.(e);
        Keyboard.dismiss();
      }}
    />
  );
};

export default OneLineTextInput;

