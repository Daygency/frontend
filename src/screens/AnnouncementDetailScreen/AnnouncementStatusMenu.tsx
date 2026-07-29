import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, MAIN, RED } from "../../color";
import styles from "./announcementStatusMenuStyles";

export type AnnouncementStatusValue = "모집중" | "모집마감" | "종료";

const STATUS_OPTIONS: { value: AnnouncementStatusValue; label: string }[] = [
  { value: "모집중", label: "모집중" },
  { value: "모집마감", label: "모집마감" },
  { value: "종료", label: "종료하기" },
];

interface AnnouncementStatusMenuProps {
  value: AnnouncementStatusValue;
  onSelect: (next: AnnouncementStatusValue) => void;
  disabled?: boolean;
}

const AnnouncementStatusMenu = ({
  value,
  onSelect,
  disabled = false,
}: AnnouncementStatusMenuProps) => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleSelect = (next: AnnouncementStatusValue) => {
    setSheetVisible(false);
    if (next !== value) onSelect(next);
  };

  return (
    <View>
      <Pressable
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => setSheetVisible(true)}
        disabled={disabled}
        hitSlop={6}
      >
        <Text style={styles.triggerText}>{value}</Text>
        <Ionicons name="chevron-down" size={14} color={BLACK} />
      </Pressable>
      <Modal
        visible={sheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setSheetVisible(false)}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>공고 상태 변경</Text>
            {STATUS_OPTIONS.map((opt) => {
              const selected = opt.value === value;
              const isDanger = opt.value === "종료";
              return (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                  ]}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isDanger && styles.optionTextDanger,
                      selected && !isDanger && styles.optionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={isDanger ? RED.DEFAULT : MAIN.DEFAULT}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default AnnouncementStatusMenu;
