import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WHITE } from "../../../color";
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
import { resolveAnnouncementAuthorLabel } from "../../../lib/announcement/announcementAuthor";
import { getImageAverageColor } from "../../../lib/media/getImageAverageColor";
import { formatPerformanceListDateLabel } from "../../../lib/news/formatPerformanceOpenLabel";
import {
  CURATION_LOADING_BACKGROUND,
  type CurationThemeState,
} from "../../../screens/MainHomeScreen/curationTheme";

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

interface AllContentSceneProps {
  tab?: MainHomeContentTab;
  onCurationThemeChange?: (theme: CurationThemeState | null) => void;
  hideWhileCurationLoading?: boolean;
}

const AllContentScene = ({
  tab = "홈",
  onCurationThemeChange,
  hideWhileCurationLoading = false,
}: AllContentSceneProps) => {
  const navigation = useNavigation<NavigationProp>();
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
  const activeCurationBannerIndexRef = useRef(0);

  const loadHome = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  useFocusEffect(
    useCallback(() => {
      void loadHome();
    }, [loadHome]),
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

  useEffect(() => {
    if (tab !== "큐레이션" || !onCurationThemeChange) return;

    let cancelled = false;

    const resolveCurationTheme = async () => {
      if (loading) {
        onCurationThemeChange({
          loading: true,
          backgroundColor: CURATION_LOADING_BACKGROUND,
        });
        return;
      }

      const firstBanner = carouselBanners[0];
      if (!firstBanner) {
        if (!cancelled) {
          onCurationThemeChange({
            loading: false,
            backgroundColor: CURATION_LOADING_BACKGROUND,
          });
        }
        return;
      }

      onCurationThemeChange({
        loading: true,
        backgroundColor: CURATION_LOADING_BACKGROUND,
      });

      try {
        const averageColor = await getImageAverageColor(firstBanner.imageUrl);
        if (!cancelled) {
          onCurationThemeChange({
            loading: false,
            backgroundColor: averageColor,
          });
        }
      } catch {
        if (!cancelled) {
          onCurationThemeChange({
            loading: false,
            backgroundColor: "#1a1a1a",
          });
        }
      }
    };

    void resolveCurationTheme();

    return () => {
      cancelled = true;
    };
  }, [carouselBanners, loading, onCurationThemeChange, tab]);

  const updateCurationBackgroundForBanner = useCallback(
    async (index: number) => {
      if (!onCurationThemeChange) return;

      const banner = carouselBanners[index];
      if (!banner) return;

      activeCurationBannerIndexRef.current = index;

      try {
        const averageColor = await getImageAverageColor(banner.imageUrl);
        onCurationThemeChange({
          loading: false,
          backgroundColor: averageColor,
        });
      } catch {
        onCurationThemeChange({
          loading: false,
          backgroundColor: "#1a1a1a",
        });
      }
    },
    [carouselBanners, onCurationThemeChange],
  );

  const handleCurationBannerIndexChange = useCallback(
    (index: number) => {
      if (tab !== "큐레이션" || index === activeCurationBannerIndexRef.current) {
        return;
      }
      void updateCurationBackgroundForBanner(index);
    },
    [tab, updateCurationBackgroundForBanner],
  );

  if (loading && tab !== "큐레이션") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: WHITE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

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
    if (hideWhileCurationLoading) {
      return null;
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: "transparent" }}>
        {carouselBanners.length === 0 ? (
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              paddingVertical: 48,
              textAlign: "center",
            }}
          >
            큐레이션이 없습니다.
          </Text>
        ) : (
          <ImageCarousel
            gap={12}
            banners={carouselBanners}
            loop
            slideBackgroundColor={CURATION_LOADING_BACKGROUND}
            onActiveIndexChange={handleCurationBannerIndexChange}
            onPressBanner={(bannerId) => {
              (navigation as { navigate: (a: string, b?: object) => void }).navigate(
                RootRoutes.HOME_BANNER_DETAIL,
                { bannerId },
              );
            }}
          />
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView>
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
              status={item.isRecruiting ? "모집중" : "모집마감"}
              daysLeft={parseAnnouncementDaysLeft(item.dDay)}
              deadlineAt={item.deadlineAt}
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
                  status: item.isRecruiting ? "모집중" : "모집마감",
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
          // 이미 ContentTab 내부라 탭으로 직접 이동하는 게 가장 확실합니다.
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
    </ScrollView>
  );
};

export default AllContentScene;
