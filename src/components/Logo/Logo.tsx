import { Text, View } from "react-native";
import styles from "./styles";

interface LogoProp {
  size: number;
}

const Logo = ({ size }: LogoProp) => {
  return (
    <View>
      <Text style={[styles.text, { fontSize: size }]}>
        DAYGENCY
      </Text>
    </View>
  );
};

export default Logo;
