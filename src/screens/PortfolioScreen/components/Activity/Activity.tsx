import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import styles from "./styles";
import portfolioStyles from "../../styles";
import { GRAY } from "../../../../color";
import Section from "../../../../components/Section/Section";
import ReviewCard from "../../../../components/ReviewCard/ReviewCard";
import {
  getReceivedActivityReviewList,
  getUserReceivedActivityReviewList,
} from "../../../../lib/apis/announcement/activityReviewApi";
import type { ActivityReviewListItem } from "../../../../lib/apis/announcement/activityReviewTypes";

type ActivityProps = {
  embedded?: boolean;
  /** 타인 포트폴리오 — 해당 유저가 받은 후기 */
  userId?: string;
};

const Activity = ({ embedded = false, userId }: ActivityProps) => {
  const [reviews, setReviews] = useState<ActivityReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReceivedReviews = useCallback(async () => {
    setLoading(true);
    const trimmedUserId = userId?.trim();
    const res = trimmedUserId
      ? await getUserReceivedActivityReviewList(trimmedUserId, { limit: 20 })
      : await getReceivedActivityReviewList({ limit: 20 });
    if (!res) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setReviews(res.items);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadReceivedReviews();
  }, [loadReceivedReviews]);

  const formatDate = (iso?: string | null) => {
    if (!iso?.trim()) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const reactionLabel = (rating: ActivityReviewListItem["rating"]) => {
    if (rating === "DISAPPOINTING") return "아쉬웠어요";
    if (rating === "GOOD") return "좋았어요";
    return "감동했어요";
  };

  const inner = (
    <View style={embedded ? styles.embeddedContainer : styles.container}>
      <Section
        title="받은 후기"
        onPressMore={() => {}}
        styles={embedded ? portfolioStyles.sectionStyles : undefined}
      >
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="small" color={GRAY.DARK} />
          </View>
        ) : reviews.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ fontSize: 14, color: GRAY.DARK_100 }}>
              받은 후기가 없습니다.
            </Text>
          </View>
        ) : (
          reviews.map((item) => (
            <ReviewCard
              key={item.id}
              author={
                item.reviewer?.activityName || item.reviewer?.name || "작성자"
              }
              date={formatDate(item.createdAt)}
              title={item.announcement?.title || item.postId}
              reactionTag={reactionLabel(item.rating)}
            />
          ))
        )}
      </Section>
    </View>
  );

  if (embedded) {
    return inner;
  }

  return <ScrollView>{inner}</ScrollView>;
};

export default Activity;
