import { Text, View } from "react-native";

interface LogoProp {
  size: number;
}

const Logo = ({ size }: LogoProp) => {
  return (
    <View>
      <Text style={{ fontSize: size, fontWeight: "700" }}>DAYGENCY</Text>
    </View>
  );
};

export default Logo;
