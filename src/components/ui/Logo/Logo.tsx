import { Text, View } from "react-native";
import { MAIN, GRAY } from "../../../color";
import {
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  MAIN_HOME_TOP_BAR_TITLE_SIZE,
} from "../../layout/MainHomeTopBar/styles";

interface LogoProp {
  size?: number;
  logoName: string;
  subtitle?: string;
}

const Logo = ({
  logoName,
  size = MAIN_HOME_TOP_BAR_TITLE_SIZE,
  subtitle,
}: LogoProp) => {
  const lineHeight =
    size === MAIN_HOME_TOP_BAR_TITLE_SIZE
      ? MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT
      : size + 6;

  return (
    <View>
      <Text
        style={{
          fontSize: size,
          lineHeight,
          fontWeight: "700",
          color: MAIN.DEFAULT,
          includeFontPadding: false,
        }}
      >
        {logoName}
      </Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: 1,
            fontSize: size * 0.6,
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
