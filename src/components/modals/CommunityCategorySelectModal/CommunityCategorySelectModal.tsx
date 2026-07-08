import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../../color";
import type { CommunityCategory } from "../../../lib/apis/community/types";
import styles from "./styles";

type CommunityCategorySelectModalProps = {
  visible: boolean;
  categories: CommunityCategory[];
  selectedCategoryId: string | null;
  onSelect: (category: CommunityCategory) => void;
  onClose: () => void;
};

const CommunityCategorySelectModal = ({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose,
}: CommunityCategorySelectModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>카테고리 선택</Text>
          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {categories.map((c) => {
              const selected = c.categoryId === selectedCategoryId;
              return (
                <Pressable
                  key={c.categoryId}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                  ]}
                  onPress={() => onSelect(c)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {c.name}
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

export default CommunityCategorySelectModal;
