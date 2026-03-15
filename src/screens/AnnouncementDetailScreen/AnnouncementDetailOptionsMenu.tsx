import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, WHITE } from "../../color";

interface AnnouncementDetailOptionsMenuProps {
  isMine: boolean;
  postId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

const AnnouncementDetailOptionsMenu = ({
  isMine,
  onEdit,
  onDelete,
  onReport,
}: AnnouncementDetailOptionsMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    x: 0,
    y: 0,
  });
  const dotsRef = useRef<View>(null);

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setMenuVisible(false);
    onDelete?.();
  };

  const handleReport = () => {
    setMenuVisible(false);
    onReport?.();
  };

  const menuItems: { label: string; onPress: () => void }[] = [];
  if (isMine) {
    menuItems.push({ label: "수정", onPress: handleEdit });
    menuItems.push({ label: "삭제", onPress: handleDelete });
  } else {
    menuItems.push({ label: "신고", onPress: handleReport });
  }

  const toggleMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    } else {
      dotsRef.current?.measureInWindow((x, y, width) => {
        setDropdownPosition({ x: x + width - 120, y: y + 28 });
        setMenuVisible(true);
      });
    }
  };

  return (
    <View style={styles.rightItemsWrap}>
      <Pressable hitSlop={10}>
        <MaterialCommunityIcons
          name="bookmark-outline"
          size={21}
          color="#000"
        />
      </Pressable>
      <Pressable hitSlop={10}>
        <MaterialCommunityIcons name="share-variant" size={21} color="#000" />
      </Pressable>
      <View ref={dotsRef} collapsable={false}>
        <Pressable hitSlop={10} onPress={toggleMenu} style={styles.dotsButton}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={21}
            color="#000"
          />
        </Pressable>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[styles.dropdown, { top: dropdownPosition.y, right: undefined, left: dropdownPosition.x }]}
            onStartShouldSetResponder={() => true}
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
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rightItemsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuWrapper: {
    position: "relative",
    ...(Platform.OS === "android" && { overflow: "visible" } as const),
  },
  dotsButton: {
    padding: 4,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 4,
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
      android: {
        elevation: 4,
      },
    }),
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: BLACK,
  },
});

export default AnnouncementDetailOptionsMenu;
