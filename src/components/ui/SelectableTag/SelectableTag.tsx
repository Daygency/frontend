import { Pressable, Text } from "react-native";
import SquircleView from "react-native-fast-squircle";
import styles from "./styles";

interface SelectableTagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const SelectableTag = ({ label, selected = false, onPress }: SelectableTagProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <SquircleView
          cornerSmoothing={0.6}
          style={[
            styles.tag,
            selected && styles.tagSelected,
            pressed && styles.tagPressed,
          ]}
        >
          <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
            {label}
          </Text>
        </SquircleView>
      )}
    </Pressable>
  );
};

export default SelectableTag;

