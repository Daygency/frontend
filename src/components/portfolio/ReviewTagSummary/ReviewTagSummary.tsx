import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { GRAY } from "../../../color";
import {
  getReceivedActivityReviewTagSummary,
  getUserReceivedActivityReviewTagSummary,
} from "../../../lib/apis/announcement/activityReviewApi";
import {
  POSITIVE_REASON_LABELS,
  type ActivityReviewTagSummaryItem,
} from "../../../lib/apis/announcement/activityReviewTypes";

const GAP = 8;
const MAX_LINES = 3;

type Props = {
  /** 타인 포트폴리오 userId — 없으면 내 받은 후기 집계 */
  userId?: string;
};

/** widths까지 담아 몇 번째 아이템까지 지정한 줄 수(maxLines) 안에 들어가는지 계산 */
function computeFitCount(
  widths: number[],
  containerWidth: number,
  gap: number,
  maxLines: number,
): number {
  let line = 0;
  let lineWidth = 0;
  let count = 0;
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    const isFirstInLine = lineWidth === 0;
    const needed = isFirstInLine ? w : gap + w;
    if (!isFirstInLine && lineWidth + needed > containerWidth) {
      line += 1;
      lineWidth = w;
    } else {
      lineWidth += needed;
    }
    if (line >= maxLines) return count;
    count += 1;
  }
  return count;
}

const ReviewTagSummary = ({ userId }: Props) => {
  const [items, setItems] = useState<ActivityReviewTagSummaryItem[] | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [widths, setWidths] = useState<Record<number, number>>({});
  const [moreWidth, setMoreWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);

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

  useEffect(() => {
    setWidths({});
    setMoreWidth(0);
    setExpanded(false);
  }, [items]);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const handleItemLayout = useCallback((index: number, e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidths((prev) => (prev[index] === w ? prev : { ...prev, [index]: w }));
  }, []);

  const handleMoreLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setMoreWidth((prev) => (prev === w ? prev : w));
  }, []);

  const ready =
    containerWidth > 0 &&
    moreWidth > 0 &&
    (items?.every((_, i) => widths[i] != null) ?? false);

  const { visibleCount, showMore } = useMemo(() => {
    if (!items || items.length === 0) return { visibleCount: 0, showMore: false };
    if (expanded) return { visibleCount: items.length, showMore: false };
    if (!ready) return { visibleCount: 0, showMore: false };

    const widthList = items.map((_, i) => widths[i]!);
    const fitCount = computeFitCount(widthList, containerWidth, GAP, MAX_LINES);
    if (fitCount >= items.length) {
      return { visibleCount: items.length, showMore: false };
    }

    let cutoff = fitCount;
    while (cutoff > 0) {
      const trial = [...widthList.slice(0, cutoff), moreWidth];
      const trialFit = computeFitCount(trial, containerWidth, GAP, MAX_LINES);
      if (trialFit === cutoff + 1) break;
      cutoff -= 1;
    }
    return { visibleCount: cutoff, showMore: cutoff < items.length };
  }, [items, expanded, ready, widths, moreWidth, containerWidth]);

  if (!items || items.length === 0) return null;

  const remaining = items.length - visibleCount;

  return (
    <View>
      <View pointerEvents="none" style={styles.hiddenRow}>
        {items.map((item, i) => (
          <View
            key={item.code}
            onLayout={(e) => handleItemLayout(i, e)}
            style={styles.chip}
          >
            <Text style={styles.chipText}>
              {POSITIVE_REASON_LABELS[item.code]}{" "}
              <Text style={styles.chipCount}>{item.count}</Text>
            </Text>
          </View>
        ))}
        <View onLayout={handleMoreLayout} style={styles.chip}>
          <Text style={styles.chipText}>+{Math.max(remaining, 1)}</Text>
        </View>
      </View>

      <View style={styles.row} onLayout={onContainerLayout}>
        {items.slice(0, visibleCount).map((item) => (
          <View key={item.code} style={styles.chip}>
            <Text style={styles.chipText}>
              {POSITIVE_REASON_LABELS[item.code]}{" "}
              <Text style={styles.chipCount}>{item.count}</Text>
            </Text>
          </View>
        ))}
        {showMore ? (
          <Pressable style={styles.chip} onPress={() => setExpanded(true)}>
            <Text style={styles.chipText}>+{remaining}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  hiddenRow: {
    position: "absolute",
    left: -9999,
    top: 0,
    opacity: 0,
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: GAP,
  },
  chip: {
    backgroundColor: GRAY.MEDIUM,
    borderRadius: 20,
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
