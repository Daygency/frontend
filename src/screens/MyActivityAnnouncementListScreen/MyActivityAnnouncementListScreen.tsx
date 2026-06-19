import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";
import { RootRoutes } from "../../navigations/routes";
import { getMyAnnouncements } from "../../lib/apis/userPosts/myPostsApi";
import type { MyAnnouncementPostItem } from "../../lib/apis/userPosts/types";
import styles from "./styles";

type RootStackParamList = {
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    viewCount?: number;
  };
};

const MyActivityAnnouncementListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<MyAnnouncementPostItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getMyAnnouncements();
      setItems(res ?? []);
    })();
  }, []);

  const listData = useMemo(
    () =>
      items.map((item) => {
        const daysLeft = getDaysLeft(item.deadlineAt);
        return {
          id: item.postId,
          title: item.title,
          type: item.category ?? "기타",
          status: normalizeStatus(item.status, item.deadlineAt),
          daysLeft,
          deadlineAt: item.deadlineAt,
          postId: item.postId,
          viewCount: item.viewCount,
        };
      }),
    [items],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <AnnouncementCard
              title={item.title}
              type={item.type}
              status={item.status}
              daysLeft={item.daysLeft}
              deadlineAt={item.deadlineAt}
              viewCount={item.viewCount}
              onPress={() =>
                navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                  postId: item.postId,
                  title: item.title,
                  type: item.type,
                  status: item.status,
                  daysLeft: item.daysLeft,
                  viewCount: item.viewCount,
                })
              }
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>작성한 모집공고가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

function getDaysLeft(deadlineAt?: string): number {
  if (!deadlineAt) return 0;
  const deadline = new Date(deadlineAt);
  if (isNaN(deadline.getTime())) return 0;
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function normalizeStatus(status?: string, deadlineAt?: string): string {
  if (status === "OPEN") return "모집중";
  if (status === "CLOSED") return "모집마감";
  return getDaysLeft(deadlineAt) > 0 ? "모집중" : "모집마감";
}

export default MyActivityAnnouncementListScreen;
