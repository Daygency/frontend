import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../color";
import { styles } from "./styles";

interface MajorTagFilterProps {
  selectedValues: string[];
  onPress: () => void;
}

const MajorTagFilter = ({ selectedValues, onPress }: MajorTagFilterProps) => {
  const label =
    selectedValues.length > 0 ? `전공 (${selectedValues.length})` : "전공";

  return (
    <Pressable style={styles.triggerButton} onPress={onPress}>
      <View style={styles.triggerContent}>
        <Text style={styles.triggerText}>{label}</Text>
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
