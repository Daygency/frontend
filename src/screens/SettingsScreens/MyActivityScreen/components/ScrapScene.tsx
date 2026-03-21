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
import Section from "../../../../components/Section/Section";
import { RootRoutes } from "../../../../navigations/routes";
import ImageScrollView from "../../../../components/ImageScrollView/ImageScrollView";
import CommunityCard from "../../../LoungeScreen/components/CommunityCard";
import SelectableTag from "../../../../components/SelectableTag/SelectableTag";
import AnnouncementCard from "../../../../components/AnnouncementCard/AnnouncementCard";
import styles from "../styles";
import { getMyScrappedAnnouncements } from "../../../../lib/apis/scrap/scrapApi";
import type { MyScrappedAnnouncementItem } from "../../../../lib/apis/scrap/types";

type ScrapTab = "모집공고" | "라운지";

const MOCK_SCRAP_POSTS = [
  {
    id: "1",
    title: "교향악단 바이올린 객원단원 채용",
    contentPreview: "너무 떨렸는데 관객분들 반응이 좋아서 기분이 좋네",
    author: "신바이올린",
    date: "2025.11.20",
    likes: 45,
    comments: 5,
    scraps: 45,
  },
];

type RootStackParamList = {
  MyActivityList: { type: "posts"; source?: "scrap" };
  MyActivityNewsList: { source?: "scrap" };
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
  };
};

const ScrapScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<ScrapTab>("라운지");
  const [announcementItems, setAnnouncementItems] = useState<MyScrappedAnnouncementItem[]>([]);
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
        limit: 20,
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

  const renderLoungeContent = () => (
    <>
      <Section
        title="커뮤니티"
        onPressMore={handlePressScrapCommunity}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        {MOCK_SCRAP_POSTS.length > 0 ? (
          MOCK_SCRAP_POSTS.map((item) => (
            <CommunityCard
              key={item.id}
              title={item.title}
              contentPreview={item.contentPreview}
              author={item.author}
              date={item.date}
              likes={item.likes}
              comments={item.comments}
              scraps={item.scraps}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>스크랩한 글이 없습니다.</Text>
          </View>
        )}
      </Section>
      <Section
        title="공연 소식"
        onPressMore={handlePressScrapNews}
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        <ImageScrollView
          key="scrap-news"
          styles={{ container: {} }}
          width={138}
          height={264}
          gap={14}
          type="withText"
        />
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
              status={item.isRecruiting ? "모집중" : "모집마감"}
              daysLeft={parseDDay(item.dDay)}
              onPress={() => {
                navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                  postId: item.postId,
                  title: item.title,
                  type: item.type,
                  status: item.isRecruiting ? "모집중" : "모집마감",
                  daysLeft: parseDDay(item.dDay),
                });
              }}
            />
          </View>
        )}
        contentContainerStyle={localStyles.announcementScrollContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => loadAnnouncements("more")}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loadingInitial ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>스크랩한 모집공고가 없습니다.</Text>
            </View>
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
});

function parseDDay(value?: string): number {
  if (!value) return 0;
  const num = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(num) ? num : 0;
}

export default ScrapScene;
