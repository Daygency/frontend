import { Text, View, ViewStyle } from "react-native";
import { PURPLE, RED } from "../../color";
import styles from "./styles";

type TagVariant = "type" | "status" | "countdown" | "reaction";

interface TagProps {
  text: string;
  variant?: TagVariant;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  /** countdown variant: 5일 이하 빨강, 10일 이하 보라, 그 외 기본색 */
  daysLeft?: number;
}

const Tag = ({
  text,
  variant = "type",
  borderColor,
  backgroundColor,
  textColor,
  borderRadius,
  daysLeft,
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
        if (daysLeft !== undefined) {
          if (daysLeft <= 5) {
            baseStyle.push({ backgroundColor: RED.DEFAULT });
          } else if (daysLeft <= 10) {
            baseStyle.push({ backgroundColor: PURPLE.DEFAULT });
          }
        }
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
      case "countdown":
        textStyle.push(styles.countdownTagText);
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
