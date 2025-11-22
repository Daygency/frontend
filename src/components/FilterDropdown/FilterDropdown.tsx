import { useState } from "react";
import {
  Pressable,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK } from "../../color";
import styles from "./styles";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  isSortButton?: boolean;
}

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  isSortButton = false,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  if (isSortButton) {
    return (
      <Pressable
        style={styles.sortButton}
        onPress={() => onSelect(label)}
      >
        <Text style={styles.sortButtonText}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.buttonText}>
          {selectedValue || label}
        </Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={BLACK}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.option,
                  selectedValue === option && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default FilterDropdown;

