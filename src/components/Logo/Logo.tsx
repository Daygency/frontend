import { Text, View } from "react-native";
import { MAIN, GRAY } from "../../color";

interface LogoProp {
  size: number;
  logoName: string;
  subtitle?: string;
}

const Logo = ({ logoName, size, subtitle }: LogoProp) => {
  return (
    <View>
      <Text style={{ fontSize: size, fontWeight: "700", color: MAIN.DEFAULT }}>
        {logoName}
      </Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: 2,
            fontSize: size * 0.5,
            color: GRAY.DARK_2,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default Logo;
