import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Section from "../../../../components/ui/Section";
import { RootRoutes } from "../../../../navigations/routes";
import CommunityCard from "../../../LoungeScreen/components/CommunityCard";
import EmptyState, { emptySectionStyle } from "../../../../components/ui/EmptyState";
import SelectableTag from "../../../../components/ui/SelectableTag";
import styles from "../styles";
import EventNewsCard from "../../../../components/cards/EventNewsCard";
import { normalizeListThumbnailUrl } from "../../../../lib/media/listThumbnailUrl";
import {
  getMyLikedComments,
  getMyLikedHighlights,
} from "../../../../lib/apis/like/myLikesApi";
import type {
  MyLikedCommentItem,
  MyLikedCommunityItem,
  MyLikedNewsItem,
} from "../../../../lib/apis/like/types";

type LikesTab = "라운지" | "댓글";

type RootStackParamList = {
  MyActivityList: { type: "posts"; source?: "like" };
  MyActivityNewsList: { source?: "like" };
  MyActivityLikedCommentsList: undefined;
  CommunityDetail: { communityId: string };
  MusicNewsDetail: { newsId: string };
};

const LikesScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<LikesTab>("라운지");
  const [latestCommunity, setLatestCommunity] = useState<MyLikedCommunityItem | null>(
    null,
  );
  const [latestNews, setLatestNews] = useState<MyLikedNewsItem[]>([]);
  const [latestComments, setLatestComments] = useState<MyLikedCommentItem[]>([]);

  useEffect(() => {
    if (selectedTab !== "라운지") return;
    (async () => {
      const res = await getMyLikedHighlights();
      if (!res) {
        setLatestCommunity(null);
        setLatestNews([]);
        return;
      }
      setLatestCommunity(res.latestLikedCommunity);
      setLatestNews(res.latestLikedNews);
    })();
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab !== "댓글") return;
    (async () => {
      const res = await getMyLikedComments({ limit: 1 });
      setLatestComments(res?.items ?? []);
    })();
  }, [selectedTab]);

  const handlePressLikedCommunity = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIST, {
      type: "posts",
      source: "like",
    });
  };

  const handlePressLikedNews = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_NEWS_LIST, { source: "like" });
  };

  const handlePressLikedComments = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIKED_COMMENTS_LIST);
  };

  const handleCommentPress = (item: MyLikedCommentItem) => {
    if (item.targetType === "NEWS") {
      navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, { newsId: item.targetId });
      return;
    }
    navigation.navigate(RootRoutes.COMMUNITY_DETAIL, { communityId: item.targetId });
  };

  const renderLoungeContent = () => (
    <>
      <Section
        title="커뮤니티"
        onPressMore={handlePressLikedCommunity}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        {latestCommunity ? (
          <CommunityCard
            title={latestCommunity.title}
            contentPreview={latestCommunity.category ?? ""}
            author="나"
            date={formatDate(latestCommunity.createdAt)}
            likes={Number(latestCommunity.likeCount ?? 0)}
            comments={Number(latestCommunity.commentCount ?? 0)}
            views={Number(latestCommunity.viewCount ?? 0)}
            thumbnailUrl={normalizeListThumbnailUrl(latestCommunity.thumbnailUrl)}
            onPress={() =>
              navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
                communityId: latestCommunity.communityId,
              })
            }
          />
        ) : (
          <View style={emptySectionStyle}>
            <EmptyState message="좋아요한 글이 없습니다." />
          </View>
        )}
      </Section>
      <Section
        title="공연 소식"
        onPressMore={handlePressLikedNews}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        {latestNews.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.newsRow}
          >
            {latestNews.map((item) => (
              <View key={item.likeId} style={localStyles.newsCard}>
                <EventNewsCard
                  title={item.title}
                  place={item.place ?? ""}
                  dateRange={formatDate(item.createdAt)}
                  imageUrl={normalizeListThumbnailUrl(item.thumbnailUrl)}
                  width={138}
                  height={138}
                  onPress={() =>
                    navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
                      newsId: item.newsId,
                    })
                  }
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={emptySectionStyle}>
            <EmptyState message="좋아요한 공연 소식이 없습니다." />
          </View>
        )}
      </Section>
    </>
  );

  const renderCommentsContent = () => (
    <Section
      title="댓글"
      onPressMore={handlePressLikedComments}
      styles={{ content: { paddingHorizontal: 0 } }}
    >
      {latestComments.length > 0 ? (
        latestComments.map((item) => (
          <CommunityCard
            key={item.likeId}
            title={item.postTitle?.trim() || "댓글 단 글"}
            contentPreview={item.content}
            author="나"
            date={formatDate(item.likedAt)}
            likes={0}
            comments={0}
            onPress={() => handleCommentPress(item)}
          />
        ))
      ) : (
        <View style={emptySectionStyle}>
          <EmptyState message="좋아요한 댓글이 없습니다." />
        </View>
      )}
    </Section>
  );

  return (
    <View style={styles.postsCommentsContainer}>
      <View style={[styles.sortFilterContainer, localStyles.topTabsContainer]}>
        <SelectableTag
          label="라운지"
          selected={selectedTab === "라운지"}
          onPress={() => setSelectedTab("라운지")}
        />
        <SelectableTag
          label="댓글"
          selected={selectedTab === "댓글"}
          onPress={() => setSelectedTab("댓글")}
        />
      </View>

      <View
        style={[
          localStyles.tabContent,
          selectedTab !== "라운지" && localStyles.hidden,
        ]}
      >
        <ScrollView
          style={localStyles.loungeScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderLoungeContent()}
        </ScrollView>
      </View>

      <View
        style={[
          localStyles.tabContent,
          selectedTab !== "댓글" && localStyles.hidden,
        ]}
      >
        <ScrollView
          style={localStyles.loungeScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCommentsContent()}
        </ScrollView>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  hidden: {
    display: "none",
  },
  tabContent: {
    flex: 1,
  },
  loungeScroll: {
    flex: 1,
  },
  topTabsContainer: {
    paddingBottom: 10,
  },
  newsRow: {
    paddingHorizontal: 20,
    gap: 14,
  },
  newsCard: {
    width: 138,
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

export default LikesScene;
