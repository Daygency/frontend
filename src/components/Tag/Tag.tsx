import { Text, View, ViewStyle } from "react-native";
import styles from "./styles";

type TagVariant = "type" | "status" | "reaction";

interface TagProps {
  text: string;
  variant?: TagVariant;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}

const Tag = ({
  text,
  variant = "type",
  borderColor,
  backgroundColor,
  textColor,
  borderRadius,
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
      case "reaction":
        baseStyle.push(styles.reactionTag as ViewStyle);
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

    if (borderRadius !== undefined) {
      baseStyle.push({ borderRadius });
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
      case "reaction":
        textStyle.push(styles.reactionTagText);
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
