import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { MAIN } from "../../../color";
import Section from "../../ui/Section";
import AnnouncementCard from "../../cards/AnnouncementCard";
import EventNewsCard from "../../cards/EventNewsCard";
import GrayCard from "../../cards/GrayCard";
import ImageCarousel from "../../media/ImageCarousel";
import { isContentNew } from "../../../lib/content/newBadge";
import { ContentRoutes } from "../../../navigations/routes";
import { RootRoutes } from "../../../navigations/routes";
import { getHome } from "../../../lib/apis/home/homeApi";
import type { HomeAnnouncementItem, HomeBannerItem, HomeNewsItem } from "../../../lib/apis/home/types";
import { normalizeListThumbnailUrl } from "../../../lib/media/listThumbnailUrl";
import { parseAnnouncementDaysLeft } from "../../../lib/announcement/parseAnnouncementDaysLeft";
import { announcementListRecruitmentStatus } from "../../../lib/announcement/announcementListStatus";
import { resolveAnnouncementAuthorLabel } from "../../../lib/announcement/announcementAuthor";
import { formatPerformanceListDateLabel } from "../../../lib/news/formatPerformanceOpenLabel";
import type { CurationThemeState } from "../../../screens/MainHomeScreen/curationTheme";
import CurationFeed, {
  type CurationFeedHandle,
} from "../../../screens/MainHomeScreen/components/CurationFeed";

const NEWS_CARD_WIDTH = 138;
const NEWS_CARD_IMAGE_HEIGHT = 193;
const NEWS_CARD_GAP = 14;

type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]: undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

type NavigationProp = BottomTabNavigationProp<ContentTabParamList>;

const HOME_ANNOUNCEMENT_PREVIEW_LIMIT = 3;

type MainHomeContentTab = "홈" | "큐레이션";

export type AllContentSceneHandle = {
  scrollToTop: () => void;
  getScrollOffset: () => number;
};

interface AllContentSceneProps {
  tab?: MainHomeContentTab;
  onCurationThemeChange?: (theme: CurationThemeState | null) => void;
}

const AllContentScene = forwardRef<AllContentSceneHandle, AllContentSceneProps>(
  function AllContentScene(
    {
      tab = "홈",
      onCurationThemeChange,
    },
    ref,
  ) {
  const navigation = useNavigation<NavigationProp>();
  const scrollRef = useRef<ScrollView>(null);
  const curationFeedRef = useRef<CurationFeedHandle>(null);
  const scrollOffsetRef = useRef(0);
  const [announcements, setAnnouncements] = useState<HomeAnnouncementItem[]>([]);
  const [banners, setBanners] = useState<HomeBannerItem[]>([]);
  const [newsItems, setNewsItems] = useState<HomeNewsItem[]>([]);
  const [communityBoards, setCommunityBoards] = useState<
    {
      boardName: string;
      latestPost: string;
      communityId?: string;
      hasNew?: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        if (tab === "큐레이션") {
          curationFeedRef.current?.scrollToTop();
          return;
        }
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        scrollOffsetRef.current = 0;
      },
      getScrollOffset: () => {
        if (tab === "큐레이션") {
          return curationFeedRef.current?.getScrollOffset() ?? 0;
        }
        return scrollOffsetRef.current;
      },
    }),
    [tab],
  );

  const handleVerticalScroll = useCallback(
    (offsetY: number) => {
      scrollOffsetRef.current = offsetY;
    },
    [],
  );

  const loadHome = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "refresh") {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const home = await getHome();
      if (!home) return;
      setAnnouncements(home.latestAnnouncements ?? []);
      setBanners(home.banners ?? []);
      setNewsItems(home.recentNews ?? []);
      setCommunityBoards(
        (home.latestCommunityByCategory ?? []).map((item) => {
          const post = item.latestPost;
          return {
            boardName: item.categoryName,
            latestPost: post?.title?.trim() || "글이 없습니다.",
            communityId: post?.communityId,
            hasNew: isContentNew(post?.createdAt),
          };
        }),
      );
    } finally {
      if (mode === "refresh") {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const onRefresh = useCallback(() => {
    void loadHome("refresh");
  }, [loadHome]);

  const homeRefreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={MAIN.DEFAULT}
      colors={[MAIN.DEFAULT]}
    />
  );

  useEffect(() => {
    if (tab === "큐레이션") return;
    void loadHome();
  }, [loadHome, tab]);

  useFocusEffect(
    useCallback(() => {
      if (tab === "큐레이션") return;
      void loadHome();
    }, [loadHome, tab]),
  );

  const carouselBanners = useMemo(
    () =>
      banners
        .map((banner) => {
          const imageUrl = normalizeListThumbnailUrl(banner.imageUrl);
          if (!imageUrl) return null;
          return {
            bannerId: banner.bannerId,
            imageUrl,
          };
        })
        .filter(
          (item): item is { bannerId: string; imageUrl: string } => item != null,
        ),
    [banners],
  );

  const handleAnnouncementMore = () => {
    (navigation as { navigate: (a: string, b?: object) => void }).navigate(
      "ContentTab",
      { screen: ContentRoutes.ACTIVITY },
    );
  };

  const handleNewsMore = () => {
    (navigation as { navigate: (a: string, b?: object) => void }).navigate(
      "ContentTab",
      { screen: ContentRoutes.CHAT, params: { initialTab: "공연 소식" } },
    );
  };

  if (tab === "큐레이션") {
    return (
      <CurationFeed
        ref={curationFeedRef}
        onCurationThemeChange={onCurationThemeChange}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={(event) => handleVerticalScroll(event.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      refreshControl={homeRefreshControl}
      contentContainerStyle={
        loading
          ? { flexGrow: 1, justifyContent: "center", alignItems: "center" }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator size="small" color="#666" />
      ) : (
        <>
          <ImageCarousel
            gap={12}
            banners={carouselBanners}
            loop
            onPressBanner={(bannerId) => {
              (navigation as { navigate: (a: string, b?: object) => void }).navigate(
                RootRoutes.HOME_BANNER_DETAIL,
                { bannerId },
              );
            }}
          />
          <Section title="공연소식" onPressMore={handleNewsMore} styles={{ content: { paddingHorizontal: 0 } }}>
            {newsItems.length === 0 ? (
              <Text style={{ fontSize: 14, color: "#999", paddingVertical: 24, paddingHorizontal: 20 }}>공연소식이 없습니다</Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: NEWS_CARD_GAP,
                  paddingHorizontal: 20,
                }}
                style={{ marginTop: 5 }}
              >
                {newsItems.slice(0, 5).map((item) => (
                  <EventNewsCard
                    key={item.newsId}
                    width={NEWS_CARD_WIDTH}
                    height={NEWS_CARD_IMAGE_HEIGHT}
                    title={item.title}
                    place={item.place}
                    dateRange={formatPerformanceListDateLabel(
                      item.startedAt,
                      item.endedAt,
                    )}
                    imageUrl={normalizeListThumbnailUrl(item.thumbnailUrl) ?? undefined}
                    showNew={isContentNew(item.createdAt)}
                    onPress={() => {
                      (navigation as { navigate: (a: string, b?: object) => void }).navigate(
                        RootRoutes.MUSIC_NEWS_DETAIL,
                        { newsId: item.newsId }
                      );
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </Section>
          <Section title="모집공고" onPressMore={handleAnnouncementMore}>
            {announcements.length === 0 ? (
              <Text style={{ fontSize: 14, color: "#999", paddingVertical: 24 }}>모집공고가 없습니다</Text>
            ) : (
              announcements.slice(0, HOME_ANNOUNCEMENT_PREVIEW_LIMIT).map((item) => (
                <AnnouncementCard
                  key={item.postId}
                  title={item.title}
                  type={item.type}
                  status={announcementListRecruitmentStatus(item)}
                  daysLeft={parseAnnouncementDaysLeft(item.dDay)}
                  deadlineAt={item.deadlineAt}
                  completed={item.completed}
                  viewCount={item.viewCount}
                  priceType={item.priceType}
                  price={item.price}
                  address={item.address}
                  authorName={resolveAnnouncementAuthorLabel(item.user)}
                  profileImgUrl={item.user?.profileImgUrl}
                  showNew={isContentNew(item.createdAt)}
                  onPress={() => {
                    (navigation as { navigate: (a: string, b?: object) => void }).navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                      title: item.title,
                      type: item.type,
                      status: announcementListRecruitmentStatus(item),
                      daysLeft: parseAnnouncementDaysLeft(item.dDay),
                      postId: item.postId,
                      viewCount: item.viewCount,
                    });
                  }}
                />
              ))
            )}
          </Section>
          <Section
            title="커뮤니티"
            onPressMore={() => {
              (navigation as any).navigate(ContentRoutes.CHAT, { initialTab: "커뮤니티" });
            }}
            styles={{
              header: { marginBottom: 0 },
              content: { marginTop: 0 },
            }}
          >
            {communityBoards.length === 0 ? (
              <Text style={{ fontSize: 14, color: "#999", paddingVertical: 24 }}>커뮤니티 글이 없습니다</Text>
            ) : (
              <GrayCard
                items={communityBoards}
                onPressItem={(communityId) => {
                  (navigation as { navigate: (a: string, b?: object) => void }).navigate(
                    RootRoutes.COMMUNITY_DETAIL,
                    { communityId },
                  );
                }}
              />
            )}
          </Section>
        </>
      )}
    </ScrollView>
  );
});

export default AllContentScene;
