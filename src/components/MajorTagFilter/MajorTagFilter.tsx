import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../color";
import { styles } from "./styles";

interface MajorTagFilterProps {
  selectedValues: string[];
  onPress: () => void;
  label?: string;
}

const MajorTagFilter = ({
  selectedValues,
  onPress,
  label = "전공",
}: MajorTagFilterProps) => {
  const displayLabel =
    selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label;

  return (
    <Pressable style={styles.triggerButton} onPress={onPress}>
      <View style={styles.triggerContent}>
        <Text style={styles.triggerText}>{displayLabel}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={14}
          color={MAIN.DEFAULT}
          style={styles.triggerIcon}
        />
      </View>
    </Pressable>
  );
};

export default MajorTagFilter;
