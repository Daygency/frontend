import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { WHITE } from "../../color";
import styles from "./styles";

type FabButtonProps = {
  onPress: () => void;
  icon?: string;
  size?: number;
};

const FabButton = ({
  onPress,
  icon = "plus",
  size = 28,
}: FabButtonProps) => {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={size} color={WHITE} />
    </Pressable>
  );
};

export default FabButton;
