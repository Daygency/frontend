import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../../color";
import styles from "./styles";

type AnnouncementTypeOption = {
  label: string;
  value: string;
};

type AnnouncementTypeSelectModalProps = {
  visible: boolean;
  options: AnnouncementTypeOption[];
  selectedValue: string;
  onSelect: (option: AnnouncementTypeOption) => void;
  onClose: () => void;
};

const AnnouncementTypeSelectModal = ({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
}: AnnouncementTypeSelectModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>공고 유형 선택</Text>
          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                  ]}
                  onPress={() => onSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={MAIN.DEFAULT}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>취소</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AnnouncementTypeSelectModal;
