import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectableTag from "../../ui/SelectableTag";
import styles from "./styles";
import { MAIN } from "../../../color";

export interface TagSection {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

interface SectorTagSelectModalProps {
  visible: boolean;
  title: string;
  sections: TagSection[];
  onComplete: () => void;
}

const SectorTagSelectModal = ({
  visible,
  title,
  sections,
  onComplete,
}: SectorTagSelectModalProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onComplete}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.tagContainer}>
                {section.options.map((option) => (
                  <SelectableTag
                    key={option}
                    label={option}
                    selected={section.selectedValues.includes(option)}
                    onPress={() => section.onToggle(option)}
                  />
                ))}
              </View>
            </View>
          ))}
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

export default SectorTagSelectModal;
