import { Text, View, ViewStyle } from "react-native";
import styles from "./styles";

type TagVariant = "type" | "status" | "countdown";

interface TagProps {
  text: string;
  variant?: TagVariant;
  borderColor?: string;
}

const Tag = ({ text, variant = "type", borderColor }: TagProps) => {
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

    return baseStyle;
  };

  const getTextStyle = () => {
    switch (variant) {
      case "type":
        return styles.typeTagText;
      case "status":
        return styles.statusTagText;
      case "countdown":
        return styles.countdownTagText;
      default:
        return styles.typeTagText;
    }
  };

  return (
    <View style={getStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
};

export default Tag;



