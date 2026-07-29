import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, GRAY, MAIN, RED, WHITE } from "../../color";

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        style={[props.style, styles.backdropZIndex]}
      />
    ),
    [],
  );

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
      {sheetVisible ? (
        <BottomSheet
          index={0}
          enableDynamicSizing
          enablePanDownToClose
          onClose={() => setSheetVisible(false)}
          backdropComponent={renderBackdrop}
          containerStyle={styles.containerZIndex}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <BottomSheetView style={styles.sheetContent}>
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
          </BottomSheetView>
        </BottomSheet>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: GRAY.MEDIUM_2,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "600",
    color: BLACK,
  },
  backdropZIndex: {
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
    }),
  },
  containerZIndex: {
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
    }),
  },
  sheetBackground: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY.DARK_1,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  optionRowPressed: {
    backgroundColor: GRAY.DEFAULT,
  },
  optionText: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: MAIN.DEFAULT,
    fontWeight: "700",
  },
  optionTextDanger: {
    color: RED.DEFAULT,
  },
});

export default AnnouncementStatusMenu;
