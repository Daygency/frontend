import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../color";
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
  const [draftValue, setDraftValue] = useState<string | undefined>(selectedValue);
  const { bottom } = useSafeAreaInsets();
  const closeSheet = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    setDraftValue(selectedValue);
  }, [isOpen, selectedValue]);

  const handleSelect = (value: string) => {
    setDraftValue(value);
  };

  const handleConfirm = () => {
    if (draftValue) onSelect(draftValue);
    closeSheet();
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
        onPress={() => {
          if (isOpen) closeSheet();
          else setIsOpen(true);
        }}
      >
        <Text style={styles.buttonText}>
          {selectedValue || label}
        </Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={MAIN.DEFAULT}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSheet}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label} 선택</Text>
          </View>

          <ScrollView
            style={styles.optionsScroll}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = draftValue === option;
              return (
                <Pressable
                  key={option}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: bottom + 16 }]}>
            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>선택 완료</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterDropdown;

