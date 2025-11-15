import { Text, View } from "react-native";
import { MAIN } from "../../color";

interface LogoProp {
  size: number;
}

const Logo = ({ size }: LogoProp) => {
  return (
    <View>
      <Text style={{ fontSize: size, fontWeight: "700", color: MAIN.DEFAULT }}>
        DAYGENCY
      </Text>
    </View>
  );
};

export default Logo;
