import { useEffect, useRef, useState } from "react";
import {
  InteractionManager,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, WHITE } from "../../../color";

type PostDetailOptionsMenuProps = {
  isMine: boolean;
  loading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
};

const PostDetailOptionsMenu = ({
  isMine,
  loading = false,
  onEdit,
  onDelete,
  onReport,
}: PostDetailOptionsMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const dotsRef = useRef<View>(null);

  const menuItems: { label: string; onPress: () => void }[] = [];
  if (isMine) {
    if (onEdit) menuItems.push({ label: "수정", onPress: () => { setMenuVisible(false); onEdit(); } });
    if (onDelete) menuItems.push({ label: "삭제", onPress: () => { setMenuVisible(false); onDelete(); } });
  } else if (onReport) {
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
      setDropdownPosition({ x: x + width - 120, y: y + 28 });
      setMenuVisible(true);
    });
  };

  if (menuItems.length === 0) return null;

  return (
    <View ref={dotsRef} collapsable={false}>
      <Pressable hitSlop={10} onPress={toggleMenu} style={styles.dotsButton}>
        <MaterialCommunityIcons name="dots-vertical" size={21} color="#000" />
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

export default PostDetailOptionsMenu;
