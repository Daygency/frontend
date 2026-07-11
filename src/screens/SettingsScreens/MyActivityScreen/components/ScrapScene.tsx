import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Section from "../../../../components/ui/Section";
import { RootRoutes } from "../../../../navigations/routes";
import CommunityCard from "../../../LoungeScreen/components/CommunityCard";
import EmptyState, {
  contentContainerWhenEmpty,
  emptySectionStyle,
} from "../../../../components/ui/EmptyState";
import SelectableTag from "../../../../components/ui/SelectableTag";
import AnnouncementCard from "../../../../components/cards/AnnouncementCard";
import styles from "../styles";
import EventNewsCard from "../../../../components/cards/EventNewsCard";
import { normalizeListThumbnailUrl } from "../../../../lib/media/listThumbnailUrl";
import {
  getMyScrappedAnnouncements,
  getMyScrappedHighlights,
} from "../../../../lib/apis/scrap/scrapApi";
import { parseAnnouncementDaysLeft } from "../../../../lib/announcement/parseAnnouncementDaysLeft";
import { announcementListRecruitmentStatus } from "../../../../lib/announcement/announcementListStatus";
import type {
  MyScrappedAnnouncementItem,
  MyScrappedCommunityItem,
  MyScrappedNewsItem,
} from "../../../../lib/apis/scrap/types";

type ScrapTab = "모집공고" | "라운지";

type RootStackParamList = {
  MyActivityList: { type: "posts"; source?: "scrap" };
  MyActivityNewsList: { source?: "scrap" };
  CommunityDetail: { communityId: string };
  MusicNewsDetail: { newsId: string };
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    viewCount?: number;
  };
};

const ScrapScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<ScrapTab>("라운지");
  const [announcementItems, setAnnouncementItems] = useState<MyScrappedAnnouncementItem[]>([]);
  const [latestCommunity, setLatestCommunity] = useState<MyScrappedCommunityItem | null>(
    null,
  );
  const [latestNews, setLatestNews] = useState<MyScrappedNewsItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handlePressScrapCommunity = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIST, {
      type: "posts",
      source: "scrap",
    });
  };

  const handlePressScrapNews = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_NEWS_LIST, { source: "scrap" });
  };

  const loadAnnouncements = useCallback(
    async (mode: "initial" | "more") => {
      if (mode === "initial") {
        setLoadingInitial(true);
      } else {
        if (loadingInitial || loadingMore || !hasMore) return;
        setLoadingMore(true);
      }

      const res = await getMyScrappedAnnouncements({
        limit: 8,
        cursor: mode === "more" ? (nextCursor ?? undefined) : undefined,
      });

      if (!res) {
        if (mode === "initial") {
          setAnnouncementItems([]);
          setHasMore(false);
          setNextCursor(null);
        }
      } else {
        setAnnouncementItems((prev) =>
          mode === "initial" ? res.items : [...prev, ...res.items],
        );
        setHasMore(res.hasMore);
        setNextCursor(res.nextCursor);
      }

      if (mode === "initial") setLoadingInitial(false);
      else setLoadingMore(false);
    },
    [hasMore, loadingInitial, loadingMore, nextCursor],
  );

  useEffect(() => {
    if (selectedTab !== "모집공고") return;
    loadAnnouncements("initial");
  }, [selectedTab, loadAnnouncements]);

  useEffect(() => {
    if (selectedTab !== "라운지") return;
    (async () => {
      const res = await getMyScrappedHighlights();
      if (!res) {
        setLatestCommunity(null);
        setLatestNews([]);
        return;
      }
      setLatestCommunity(res.latestScrappedCommunity);
      setLatestNews(res.latestScrappedNews);
    })();
  }, [selectedTab]);

  const renderLoungeContent = () => (
    <>
      <Section
        title="커뮤니티"
        onPressMore={handlePressScrapCommunity}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        {latestCommunity ? (
          [
            {
              id: latestCommunity.communityId,
              title: latestCommunity.title,
              contentPreview: latestCommunity.category ?? "",
              author: "나",
              date: formatDate(latestCommunity.createdAt),
              likes: Number(latestCommunity.likeCount ?? 0),
              comments: Number(latestCommunity.commentCount ?? 0),
              views: Number(latestCommunity.viewCount ?? 0),
              thumbnailUrl: normalizeListThumbnailUrl(latestCommunity.thumbnailUrl),
            },
          ].map((item) => (
            <CommunityCard
              key={item.id}
              title={item.title}
              contentPreview={item.contentPreview}
              author={item.author}
              date={item.date}
              likes={item.likes}
              comments={item.comments}
              views={item.views}
              thumbnailUrl={item.thumbnailUrl}
              onPress={() =>
                navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
                  communityId: item.id,
                })
              }
            />
          ))
        ) : (
          <View style={emptySectionStyle}>
            <EmptyState message="스크랩한 글이 없습니다." />
          </View>
        )}
      </Section>
      <Section
        title="공연 소식"
        onPressMore={handlePressScrapNews}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        {latestNews.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.newsRow}
          >
            {latestNews.map((item) => (
              <View key={item.scrapId} style={localStyles.newsCard}>
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
            <EmptyState message="스크랩한 공연 소식이 없습니다." />
          </View>
        )}
      </Section>
    </>
  );

  const renderAnnouncementContent = () => (
    <View style={localStyles.announcementContainer}>
      <FlatList
        data={announcementItems}
        keyExtractor={(item) => item.scrapId}
        renderItem={({ item }) => (
          <View style={localStyles.cardWrapper}>
            <AnnouncementCard
              title={item.title}
              type={item.type}
              status={announcementListRecruitmentStatus(item)}
              daysLeft={parseAnnouncementDaysLeft(item.dDay)}
              deadlineAt={item.deadlineAt}
              completed={item.completed}
              viewCount={item.viewCount}
              address={item.address}
              onPress={() => {
                navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                  postId: item.postId,
                  title: item.title,
                  type: item.type,
                  status: announcementListRecruitmentStatus(item),
                  daysLeft: parseAnnouncementDaysLeft(item.dDay),
                  viewCount: item.viewCount,
                });
              }}
            />
          </View>
        )}
        contentContainerStyle={contentContainerWhenEmpty(
          !loadingInitial && announcementItems.length === 0,
          localStyles.announcementScrollContent,
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => loadAnnouncements("more")}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loadingInitial ? (
            <EmptyState message="스크랩한 모집공고가 없습니다." />
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={localStyles.loadingMoreContainer}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );

  return (
    <View style={styles.postsCommentsContainer}>
      <View style={[styles.sortFilterContainer, localStyles.topTabsContainer]}>
        <SelectableTag 
          label="모집공고"
          selected={selectedTab === "모집공고"}
          onPress={() => setSelectedTab("모집공고")}
        />
        <SelectableTag
          label="라운지"
          selected={selectedTab === "라운지"}
          onPress={() => setSelectedTab("라운지")}
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
          selectedTab !== "모집공고" && localStyles.hidden,
        ]}
      >
        {renderAnnouncementContent()}
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
  announcementContainer: {
    flex: 1,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  topTabsContainer: {
    paddingBottom: 10,
  },
  announcementListScroll: {
    flex: 1,
  },
  announcementScrollContent: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  cardWrapper: {
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  loadingMoreContainer: {
    paddingVertical: 10,
    alignItems: "center",
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

export default ScrapScene;
