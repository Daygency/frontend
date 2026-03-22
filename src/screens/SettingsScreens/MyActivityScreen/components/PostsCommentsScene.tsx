import { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Section from "../../../../components/Section/Section";
import { RootRoutes } from "../../../../navigations/routes";
import ImageScrollView from "../../../../components/ImageScrollView/ImageScrollView";
import CommunityCard from "../../../LoungeScreen/components/CommunityCard";
import SelectableTag from "../../../../components/SelectableTag/SelectableTag";
import styles from "../styles";
import AnnouncementCard from "../../../../components/AnnouncementCard/AnnouncementCard";
import EventNewsCard from "../../../../components/EventNewsCard/EventNewsCard";
import { normalizeListThumbnailUrl } from "../../../../lib/media/listThumbnailUrl";
import { getMyPostHighlights } from "../../../../lib/apis/userPosts/myPostsApi";
import type {
  MyAnnouncementPostItem,
  MyCommunityPostItem,
  MyNewsPostItem,
} from "../../../../lib/apis/userPosts/types";

type FilterOption = "작성글" | "댓글";

const MOCK_COMMENTS = [
  {
    id: "c1",
    title: "오늘 공연 후기 모음",
    contentPreview: "다들 수고 많으셨습니다! 다음 공연도 기대됩니다",
    author: "관람객A",
    date: "2025.11.18",
    likes: 32,
    comments: 12,
    scraps: 8,
  },
];

type RootStackParamList = {
  MyActivityList: { type: "posts" | "comments" };
  MyActivityNewsList: undefined;
  MyActivityAnnouncementList: undefined;
  CommunityDetail: { communityId: string };
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
  };
};

type ActivityCardItem = {
  id: string;
  title: string;
  contentPreview: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  scraps: number;
  views?: number;
  thumbnailUrl?: string;
};

const PostsCommentsScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("작성글");
  const [latestCommunity, setLatestCommunity] = useState<MyCommunityPostItem | null>(
    null,
  );
  const [recentNews, setRecentNews] = useState<MyNewsPostItem[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] =
    useState<MyAnnouncementPostItem | null>(null);
  const commentsData = selectedFilter === "댓글" ? MOCK_COMMENTS : [];
  const postsData = useMemo(
    () =>
      selectedFilter === "작성글"
        ? latestCommunity
          ? [
              {
                id: latestCommunity.communityId,
                title: latestCommunity.title,
                contentPreview: latestCommunity.category ?? "",
                author: "나",
                date: formatDate(latestCommunity.createdAt),
                likes: Number(latestCommunity.likeCount ?? 0),
                comments: Number(latestCommunity.commentCount ?? 0),
                scraps: 0,
                views: Number(latestCommunity.viewCount ?? 0),
                thumbnailUrl: normalizeListThumbnailUrl(latestCommunity.thumbnailUrl),
              },
            ]
          : []
        : [],
    [selectedFilter, latestCommunity],
  );

  useEffect(() => {
    (async () => {
      const res = await getMyPostHighlights();
      if (!res) {
        setLatestCommunity(null);
        setRecentNews([]);
        setLatestAnnouncement(null);
        return;
      }
      setLatestCommunity(res.latestCommunity);
      setRecentNews(res.recentNews);
      setLatestAnnouncement(res.latestAnnouncement);
    })();
  }, []);

  const handlePressCommunity = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIST, {
      type: selectedFilter === "작성글" ? "posts" : "comments",
    });
  };

  const handlePressNews = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_NEWS_LIST);
  };

  const handlePressAnnouncements = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_ANNOUNCEMENT_LIST);
  };

  const renderContentSection = (
    title: string,
    data: ActivityCardItem[],
    emptyMessage: string,
    onPressMore: () => void,
    onPressItem?: (item: ActivityCardItem) => void,
  ) => (
    <Section
      title={title}
      onPressMore={onPressMore}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      {data.length > 0 ? (
        data.map((item) => (
          <CommunityCard
            key={item.id}
            title={item.title}
            contentPreview={item.contentPreview}
            author={item.author}
            date={item.date}
            likes={item.likes}
            comments={item.comments}
            scraps={item.scraps}
            views={item.views}
            thumbnailUrl={item.thumbnailUrl}
            onPress={onPressItem ? () => onPressItem(item) : undefined}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}
    </Section>
  );

  const renderNewsSection = (scrollKey: string, newsItems?: MyNewsPostItem[]) => (
    <Section
      title="공연 소식"
      onPressMore={handlePressNews}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      {selectedFilter === "작성글" ? (
        newsItems && newsItems.length > 0 ? (
          <ScrollView
            key={scrollKey}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.newsRow}
          >
            {newsItems.map((item) => (
              <View key={item.newsId} style={localStyles.newsCard}>
                <EventNewsCard
                  title={item.title}
                  place={item.place ?? ""}
                  dateRange={formatDate(item.createdAt)}
                  imageUrl={normalizeListThumbnailUrl(item.thumbnailUrl)}
                  width={138}
                  height={138}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>작성한 공연 소식이 없습니다.</Text>
          </View>
        )
      ) : (
        <ImageScrollView
          key={scrollKey}
          styles={{ container: {} }}
          width={138}
          height={264}
          gap={14}
          type="withText"
        />
      )}
    </Section>
  );

  const renderAnnouncementSection = (
    item?: MyAnnouncementPostItem | null,
  ) => (
    <Section
      title="모집 공고"
      onPressMore={handlePressAnnouncements}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      {item ? (
        <View style={localStyles.announcementCard}>
          <AnnouncementCard
            title={item.title}
            type={item.category ?? "기타"}
            status={normalizeStatus(item.status, item.deadlineAt)}
            daysLeft={getDaysLeft(item.deadlineAt)}
            onPress={() =>
              navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                postId: item.postId,
                title: item.title,
                type: item.category ?? "기타",
                status: normalizeStatus(item.status, item.deadlineAt),
                daysLeft: getDaysLeft(item.deadlineAt),
              })
            }
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>작성한 모집공고가 없습니다.</Text>
        </View>
      )}
    </Section>
  );

  return (
    <ScrollView
      style={styles.postsCommentsContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sortFilterContainer}>
        <SelectableTag
          label="작성글"
          selected={selectedFilter === "작성글"}
          onPress={() => setSelectedFilter("작성글")}
        />
        <SelectableTag
          label="댓글"
          selected={selectedFilter === "댓글"}
          onPress={() => setSelectedFilter("댓글")}
        />
      </View>

      {/* 작성글: 작성글과 공연 소식 각각 별도 스크롤 상태 유지 */}
      <View style={selectedFilter === "작성글" ? undefined : localStyles.hidden}>
        {renderContentSection(
          "커뮤니티",
          postsData,
          "작성한 글이 없습니다.",
          handlePressCommunity,
          (item) => navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.id }),
        )}
        {renderNewsSection("posts", recentNews)}
        {renderAnnouncementSection(latestAnnouncement)}
      </View>

      {/* 댓글: 댓글 단 글과 공연 소식 각각 별도 스크롤 상태 유지 */}
      <View style={selectedFilter === "댓글" ? undefined : localStyles.hidden}>
        {renderContentSection(
          "커뮤니티",
          commentsData,
          "작성한 댓글이 없습니다.",
          handlePressCommunity
        )}
        {renderNewsSection("comments")}
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  hidden: {
    display: "none",
  },
  newsRow: {
    paddingHorizontal: 0,
    gap: 14,
  },
  newsCard: {
    width: 138,
  },
  announcementCard: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
});

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

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

export default PostsCommentsScene;
