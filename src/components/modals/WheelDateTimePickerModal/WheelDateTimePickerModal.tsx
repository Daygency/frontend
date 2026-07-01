import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { buildConfirmLabel } from "./wheelDateTimePickerFormat";
import styles from "./styles";

export type WheelDateTimePickerMode = "date" | "time" | "datetime";

type WheelDateTimePickerModalProps = {
  visible: boolean;
  value: Date;
  pickerMode: WheelDateTimePickerMode;
  title: string;
  description?: string;
  confirmLabel?: string | ((date: Date) => string);
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: number;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
};

const WheelDateTimePickerModal = ({
  visible,
  value,
  pickerMode,
  title,
  description,
  confirmLabel,
  minimumDate,
  maximumDate,
  minuteInterval = 1,
  onConfirm,
  onCancel,
  sheetStyle,
}: WheelDateTimePickerModalProps) => {
  const { bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [visible, value]);

  const resolvedConfirmLabel =
    typeof confirmLabel === "function"
      ? confirmLabel(draft)
      : confirmLabel ?? buildConfirmLabel(draft, pickerMode);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setDraft(selected);
    }
  };

  const handleConfirm = () => {
    onConfirm(draft);
  };

  const pickerDisplay = "spinner" as const;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(bottom, 16) + 8 }, sheetStyle]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          <View style={styles.pickerWrap}>
            <View style={styles.pickerHighlight} pointerEvents="none" />
            {pickerMode === "date" ? (
              <DateTimePicker
                value={draft}
                mode={"date" as const}
                display={pickerDisplay}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleChange}
                style={styles.picker}
                {...(Platform.OS === "ios"
                  ? { themeVariant: "dark" as const, locale: "ko-KR" as const }
                  : {})}
              />
            ) : pickerMode === "time" ? (
              // @ts-expect-error DateTimePicker prop union differs by platform/mode
              <DateTimePicker
                value={draft}
                mode={"time" as const}
                display={pickerDisplay}
                minuteInterval={minuteInterval}
                onChange={handleChange}
                style={styles.picker}
                {...(Platform.OS === "ios"
                  ? { themeVariant: "dark" as const, locale: "ko-KR" as const }
                  : {})}
              />
            ) : (
              // @ts-expect-error DateTimePicker prop union differs by platform/mode
              <DateTimePicker
                value={draft}
                mode={"datetime" as const}
                display={pickerDisplay}
                minuteInterval={minuteInterval}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleChange}
                style={styles.picker}
                {...(Platform.OS === "ios"
                  ? { themeVariant: "dark" as const, locale: "ko-KR" as const }
                  : {})}
              />
            )}
          </View>

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>{resolvedConfirmLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default WheelDateTimePickerModal;
