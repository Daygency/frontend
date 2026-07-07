import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { GRAY, MAIN, WHITE } from "../../../color";

interface MajorTagSelectModalProps {
  visible: boolean;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onComplete: () => void;
  onDismiss?: () => void;
}

const MajorTagSelectModal = ({
  visible,
  options,
  selectedValues,
  onToggle,
  onComplete,
  onDismiss,
}: MajorTagSelectModalProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onComplete}
      onDismiss={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>전공 선택</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.tagContainer}
          showsVerticalScrollIndicator={false}
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <Pressable
                key={option}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => onToggle(option)}
              >
                <Text
                  style={[
                    styles.tagText,
                    isSelected && styles.tagTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: bottom + 16 }]}>
          <Pressable
            style={styles.completeButton}
            onPress={onComplete}
          >
            <Text style={styles.completeButtonText}>선택 완료</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MajorTagSelectModal;
