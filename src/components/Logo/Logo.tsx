import { Text, View } from "react-native";
import styles from "./styles";
import { MAIN } from "../../color";

interface LogoProp {
  size: number;
}

const Logo = ({ size }: LogoProp) => {
  return (
    <View>
      <Text style={{ fontSize: size, ...styles.logoText }}>
        DAYGENCY
      </Text>
    </View>
  );
};

export default Logo;
