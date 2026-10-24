import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import styles from "./styles";

type CommunityGuidelinesModalProps = {
  visible: boolean;
  guidelines: string[];
  onClose: () => void;
};

/** 커뮤니티 글 작성 주의사항 — 바깥 영역 탭 또는 확인 버튼으로 닫힘 */
const CommunityGuidelinesModal = ({
  visible,
  guidelines,
  onClose,
}: CommunityGuidelinesModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>작성 시 주의사항</Text>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {guidelines.map((text, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.itemText}>{text}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable
            style={({ pressed }) => [
              styles.confirmBtn,
              pressed && styles.confirmBtnPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.confirmText}>확인</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CommunityGuidelinesModal;
