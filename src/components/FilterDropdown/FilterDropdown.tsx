import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

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

const styles = StyleSheet.create({
  container: {
    position: "relative",
    // flexShrink: 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
    minHeight: 36,
  },
  buttonText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  iconContainer: {
    flexShrink: 0,
  },
  sortButton: {
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  sortButtonText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  dropdownContainer: {
    backgroundColor: WHITE,
    borderRadius: 8,
    marginHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: GRAY.DEFAULT,
  },
  optionText: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "400",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});

export default FilterDropdown;

