import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GRAY } from "../../../color";
import {
  getReceivedActivityReviewTagSummary,
  getUserReceivedActivityReviewTagSummary,
} from "../../../lib/apis/announcement/activityReviewApi";
import {
  POSITIVE_REASON_LABELS,
  type ActivityReviewTagSummaryItem,
} from "../../../lib/apis/announcement/activityReviewTypes";
import { RootRoutes } from "../../../navigations/routes";

const GAP = 8;
const VISIBLE_COUNT = 4;

type Props = {
  /** 타인 포트폴리오 userId — 없으면 내 받은 후기 집계 */
  userId?: string;
};

const ReviewTagSummary = ({ userId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [items, setItems] = useState<ActivityReviewTagSummaryItem[] | null>(null);

  const load = useCallback(async () => {
    const trimmed = userId?.trim();
    const res = trimmed
      ? await getUserReceivedActivityReviewTagSummary(trimmed)
      : await getReceivedActivityReviewTagSummary();
    setItems(res ?? []);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
      return () => {};
    }, [load]),
  );

  if (!items || items.length === 0) return null;

  const visibleItems = items.slice(0, VISIBLE_COUNT);
  const remaining = items.length - visibleItems.length;

  return (
    <View style={styles.row}>
      {visibleItems.map((item) => (
        <View key={item.code} style={styles.chip}>
          <Text style={styles.chipText}>
            {POSITIVE_REASON_LABELS[item.code]}{" "}
            <Text style={styles.chipCount}>{item.count}</Text>
          </Text>
        </View>
      ))}
      {remaining > 0 ? (
        <Pressable
          style={styles.chip}
          onPress={() =>
            navigation.navigate(RootRoutes.REVIEW_TAG_SUMMARY_LIST, { userId })
          }
        >
          <Text style={styles.chipText}>
            +<Text style={styles.chipCount}>{remaining}</Text>
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  chip: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
    color: GRAY.DARK_100,
  },
  chipCount: {
    fontWeight: "700",
  },
});

export default ReviewTagSummary;
