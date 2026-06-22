import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { MAIN } from "../../../color";
import { getReportCategories } from "../../../lib/apis/report/reportApi";
import { REPORT_CATEGORY_OPTIONS } from "../../../lib/report/reportCategories";
import type { ReportCategory } from "../../../lib/apis/report/types";
import styles from "./styles";

type ReportCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: ReportCategory) => void;
  submitting?: boolean;
};

const ReportCategoryModal = ({
  visible,
  onClose,
  onSelect,
  submitting = false,
}: ReportCategoryModalProps) => {
  const [options, setOptions] = useState(REPORT_CATEGORY_OPTIONS);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      const res = await getReportCategories();
      if (cancelled) return;
      if (res?.categories?.length) {
        setOptions(
          res.categories.map((c) => ({
            value: c.value,
            label: c.labelKo,
          })),
        );
      } else {
        setOptions(REPORT_CATEGORY_OPTIONS);
      }
      setLoadingList(false);
    })();
    return () => {
      cancelled = true;
      setLoadingList(false);
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.sheet}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>신고 사유 선택</Text>
          <Text style={styles.subtitle}>
            신고 내용은 관리·검토를 위해 저장됩니다.
          </Text>
          {submitting ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={MAIN.DEFAULT} />
            </View>
          ) : loadingList ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={MAIN.DEFAULT} />
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                  ]}
                  onPress={() => onSelect(opt.value)}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          <Pressable style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
            <Text style={styles.cancelText}>취소</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ReportCategoryModal;
