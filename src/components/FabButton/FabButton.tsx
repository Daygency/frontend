import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { WHITE } from "../../color";
import styles from "./styles";

type FabButtonProps = {
  onPress: () => void;
  icon?: string;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const FabButton = ({
  onPress,
  icon = "plus",
  size = 28,
  containerStyle,
}: FabButtonProps) => {
  return (
    <Pressable style={[styles.fab, containerStyle]} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={size} color={WHITE} />
    </Pressable>
  );
};

export default FabButton;
