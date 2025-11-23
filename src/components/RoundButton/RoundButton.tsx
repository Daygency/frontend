import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import styles from "./styles";
import { WHITE } from "../../color";

type RoundButtonProps = {
  size: number;
};

const RoundButton = ({ size }: RoundButtonProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Feather name="user" size={size * 0.5} color={WHITE} />
    </View>
  );
};

export default RoundButton;
