import { Text, View, ViewStyle } from "react-native";
import styles from "./styles";

type TagVariant = "type" | "status" | "countdown";

interface TagProps {
  text: string;
  variant?: TagVariant;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

const Tag = ({
  text,
  variant = "type",
  borderColor,
  backgroundColor,
  textColor,
}: TagProps) => {
  const getStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.tag];

    switch (variant) {
      case "type":
        baseStyle.push(styles.typeTag as ViewStyle);
        break;
      case "status":
        baseStyle.push(styles.statusTag as ViewStyle);
        break;
      case "countdown":
        baseStyle.push(styles.countdownTag as ViewStyle);
        break;
      default:
        baseStyle.push(styles.typeTag as ViewStyle);
    }

    // borderColor가 제공되면 적용
    if (borderColor) {
      baseStyle.push({ borderColor, borderWidth: 1 });
    }

    if (backgroundColor) {
      baseStyle.push({ backgroundColor });
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const textStyle: any[] = [];
    switch (variant) {
      case "type":
        textStyle.push(styles.typeTagText);
        break;
      case "status":
        textStyle.push(styles.statusTagText);
        break;
      case "countdown":
        textStyle.push(styles.countdownTagText);
        break;
      default:
        textStyle.push(styles.typeTagText);
    }

    if (textColor) {
      textStyle.push({ color: textColor });
    }

    return textStyle;
  };

  return (
    <View style={getStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
};

export default Tag;
