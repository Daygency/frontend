import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { GRAY, WHITE } from "../../color";
import { themedStyles } from "../../theme/themedStyles";
import EmptyState from "../../components/ui/EmptyState";
import {
  getReceivedActivityReviewTagSummary,
  getUserReceivedActivityReviewTagSummary,
} from "../../lib/apis/announcement/activityReviewApi";
import {
  POSITIVE_REASON_LABELS,
  type ActivityReviewTagSummaryItem,
} from "../../lib/apis/announcement/activityReviewTypes";

type RouteParams = {
  userId?: string;
};

const ReviewTagSummaryListScreen = () => {
  const route = useRoute();
  const { userId } = (route.params as RouteParams | undefined) ?? {};

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

  if (items == null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={GRAY.DARK} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <EmptyState message="받은 후기 태그가 없습니다." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.code} style={styles.row}>
          <Text style={styles.label}>{POSITIVE_REASON_LABELS[item.code]}</Text>
          <Text style={styles.count}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = themedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 12,
    gap: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    color: GRAY.DARK_100,
  },
  count: {
    fontSize: 14,
    fontWeight: "700",
    color: GRAY.DARK_100,
  },
}));

export default ReviewTagSummaryListScreen;
