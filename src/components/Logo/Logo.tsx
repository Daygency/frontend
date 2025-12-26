import { Text, View } from "react-native";
import { MAIN } from "../../color";
interface LogoProp {
  size: number;
  logoName: string;
}

const Logo = ({ logoName, size }: LogoProp) => {
  return (
    <View>
      <Text style={{ fontSize: size, fontWeight: "700", color: MAIN.DEFAULT }}>
        {logoName}
      </Text>
    </View>
  );
};

export default Logo;
