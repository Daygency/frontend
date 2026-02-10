import { Pressable, Text } from "react-native";
import styles from "./styles";

interface SelectableTagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const SelectableTag = ({ label, selected = false, onPress }: SelectableTagProps) => {
  return (
    <Pressable
      style={[styles.tag, selected && styles.tagSelected]}
      onPress={onPress}
    >
      <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default SelectableTag;

