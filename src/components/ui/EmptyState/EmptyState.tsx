import { StyleProp, Text, TextStyle } from "react-native";
import styles from "./styles";

type Props = {
  message: string;
  textStyle?: StyleProp<TextStyle>;
};

const EmptyState = ({ message, textStyle }: Props) => (
  <Text style={[styles.text, textStyle]}>{message}</Text>
);

export default EmptyState;
