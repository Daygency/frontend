import { useRef, useState } from "react";
import {
  Alert,
  InteractionManager,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { BLACK, GRAY, WHITE } from "../../../color";

type ReviewOptionsMenuProps = {
  isOwnProfile: boolean;
  isHidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
  onReport?: () => void;
  loading?: boolean;
};

const ReviewOptionsMenu = ({
  isOwnProfile,
  isHidden = false,
  onHide,
  onUnhide,
  onReport,
  loading = false,
}: ReviewOptionsMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const dotsRef = useRef<View>(null);

  const menuItems: { label: string; onPress: () => void }[] = [];
  if (isOwnProfile && onHide && !isHidden) {
    menuItems.push({
      label: "숨김",
      onPress: () => {
        setMenuVisible(false);
        Alert.alert(
          "후기 숨김",
          "이 후기를 내 프로필에서 숨길까요?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "숨기기",
              style: "destructive",
              onPress: () => onHide(),
            },
          ],
        );
      },
    });
  }
  if (isOwnProfile && isHidden && onUnhide) {
    menuItems.push({
      label: "다시 표시",
      onPress: () => {
        setMenuVisible(false);
        Alert.alert(
          "후기 다시 표시",
          "이 후기를 내 프로필에 다시 표시할까요?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "다시 표시",
              onPress: () => onUnhide(),
            },
          ],
        );
      },
    });
  }
  if (onReport) {
    menuItems.push({
      label: "신고",
      onPress: () => {
        setMenuVisible(false);
        InteractionManager.runAfterInteractions(() => onReport());
      },
    });
  }

  const toggleMenu = () => {
    if (loading || menuItems.length === 0) return;
    if (menuVisible) {
      setMenuVisible(false);
      return;
    }
    dotsRef.current?.measureInWindow((x, y, width) => {
      setDropdownPosition({ x: x + width - 120, y: y + 22 });
      setMenuVisible(true);
    });
  };

  if (menuItems.length === 0) return null;

  return (
    <View ref={dotsRef} collapsable={false}>
      <Pressable hitSlop={10} onPress={toggleMenu} style={styles.dotsButton}>
        <Entypo name="dots-three-vertical" size={16} color="black" />
      </Pressable>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalRoot} pointerEvents="box-none">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuVisible(false)}
          />
          <View
            style={[
              styles.dropdown,
              { top: dropdownPosition.y, left: dropdownPosition.x },
            ]}
            pointerEvents="box-none"
          >
            {menuItems.map((item) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={item.onPress}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalRoot: { flex: 1 },
  dotsButton: { padding: 4 },
  dropdown: {
    position: "absolute",
    minWidth: 120,
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuItemPressed: { backgroundColor: GRAY.DEFAULT },
  menuItemText: { fontSize: 14, fontWeight: "500", color: BLACK },
});

export default ReviewOptionsMenu;
