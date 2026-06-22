import { useRef, useState } from "react";
import {
  Alert,
  InteractionManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, GRAY, MAIN, WHITE } from "../../../color";

type Variant = "header" | "comment" | "reply";

type ReportDotsDropdownMenuProps = {
  enabled: boolean;
  onReport: () => void;
  loading?: boolean;
  /** enabled가 false일 때 ⋮ 탭 시 알림 */
  disabledMessage?: string;
  variant?: Variant;
};

/**
 * ⋮ → 드롭다운에 「신고」 → 탭 시 onReport (카테고리 모달 등)
 */
const ReportDotsDropdownMenu = ({
  enabled,
  onReport,
  loading = false,
  disabledMessage = "신고할 수 있는 글이 아닙니다.",
  variant = "header",
}: ReportDotsDropdownMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const dotsRef = useRef<View>(null);

  const toggleMenu = () => {
    if (loading) return;
    if (!enabled) {
      Alert.alert("알림", disabledMessage);
      return;
    }
    if (menuVisible) {
      setMenuVisible(false);
    } else {
      dotsRef.current?.measureInWindow((x, y, width, height) => {
        const menuWidth = 120;
        if (variant === "header") {
          setDropdownPosition({
            x: x + width - menuWidth,
            y: y + 28,
          });
        } else {
          setDropdownPosition({
            x: x + width - menuWidth,
            y: y + height + 4,
          });
        }
        setMenuVisible(true);
      });
    }
  };

  const handleReport = () => {
    setMenuVisible(false);
    InteractionManager.runAfterInteractions(() => {
      onReport();
    });
  };

  const icon =
    variant === "header" ? (
      <MaterialCommunityIcons name="dots-vertical" size={21} color="#000" />
    ) : (
      <Ionicons
        name="ellipsis-vertical"
        size={variant === "reply" ? 16 : 18}
        color={MAIN.DEFAULT}
      />
    );

  return (
    <>
      <View ref={dotsRef} collapsable={false}>
        <Pressable
          hitSlop={variant === "header" ? 10 : 8}
          onPress={toggleMenu}
          style={variant === "header" ? styles.dotsButtonHeader : undefined}
        >
          {icon}
        </Pressable>
      </View>
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
              {
                top: dropdownPosition.y,
                left: dropdownPosition.x,
              },
            ]}
            pointerEvents="box-none"
          >
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleReport}
            >
              <Text style={styles.menuItemText}>신고</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  dotsButtonHeader: {
    padding: 4,
  },
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

export default ReportDotsDropdownMenu;
