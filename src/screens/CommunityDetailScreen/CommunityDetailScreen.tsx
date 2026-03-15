import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import CommentInputBar from "../../components/CommentInputBar/CommentInputBar";
import styles from "./styles";
import { getCommunityDetail } from "../../lib/apis/community/communityApi";
import type { CommunityDetailResponse } from "../../lib/apis/community/types";

type CommunityDetailRouteParams = {
  communityId: string;
};

type CommunityDetailRouteProp = RouteProp<
  { CommunityDetail: CommunityDetailRouteParams },
  "CommunityDetail"
>;

const CommunityDetailScreen = () => {
  const route = useRoute<CommunityDetailRouteProp>();
  const { communityId } = route.params;
  const { bottom } = useSafeAreaInsets();
  const [data, setData] = useState<CommunityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getCommunityDetail(communityId);
      setData(res);
      setLoading(false);
    })();
  }, [communityId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.scrollContent, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <View style={[styles.scrollContent, { alignItems: "center", justifyContent: "center" }]}>
          <Text>게시글을 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{data.category?.name}</Text>
          </View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.meta}>
            {data.user && (data.user as any).nickname
              ? String((data.user as any).nickname)
              : "알수없음"}{" "}
            · {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyText}>{data.content}</Text>
        </View>

        <View style={styles.firstCommentPlaceholder}>
          <Text style={styles.firstCommentText}>첫 댓글을 남겨보세요.</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.commentInputContainer,
          { paddingBottom: (bottom || 0) + 10 },
        ]}
      >
        <CommentInputBar placeholder="댓글을 입력해주세요" />
      </View>
    </View>
  );
};

export default CommunityDetailScreen;
