import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { WHITE } from "../../color";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const NEWS_CARD_WIDTH = 138;
const NEWS_CARD_IMAGE_HEIGHT = 193;
const NEWS_CARD_GAP = 14;
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import Section from "../Section/Section";
import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import EventNewsCard from "../EventNewsCard/EventNewsCard";
import GrayCard from "../GrayCard/GrayCard";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { isContentNew } from "../../lib/content/newBadge";
import { ContentRoutes } from "../../navigations/routes";
import { RootRoutes } from "../../navigations/routes";
import { getHome } from "../../lib/apis/home/homeApi";
import type { HomeAnnouncementItem, HomeBannerItem, HomeNewsItem } from "../../lib/apis/home/types";
import { normalizeListThumbnailUrl } from "../../lib/media/listThumbnailUrl";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { resolveRecruitmentMajorDisplayNames } from "../../lib/announcement/recruitmentMajors";

type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]: undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

type NavigationProp = BottomTabNavigationProp<ContentTabParamList>;

function formatStartedAt(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${h}:${min}`;
  } catch {
    return iso;
  }
}

const HOME_ANNOUNCEMENT_PREVIEW_LIMIT = 3;

type MainHomeContentTab = "홈" | "큐레이션";

interface AllContentSceneProps {
  tab?: MainHomeContentTab;
}

const AllContentScene = ({ tab = "홈" }: AllContentSceneProps) => {
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
  const [majorsCatalog, setMajorsCatalog] = useState<
    { name: string; majorId: string }[]
  >([]);

  useEffect(() => {
    getMajors().then((list) => {
      setMajorsCatalog(
        list.map((m) => ({
          name: m.name,
          majorId:
            (m as { majorId?: string }).majorId ??
            (m as { id?: string }).id ??
            "",
        })),
      );
    });
  }, []);

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

  if (loading) {
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
      { screen: ContentRoutes.CHAT },
    );
  };

  const carouselBanners = banners
    .map((banner) => {
      const imageUrl = normalizeListThumbnailUrl(banner.imageUrl);
      if (!imageUrl) return null;
      return {
        bannerId: banner.bannerId,
        imageUrl,
      };
    })
    .filter((item): item is { bannerId: string; imageUrl: string } => item != null);

  if (tab === "큐레이션") {
    return (
      <ScrollView>
        {carouselBanners.length === 0 ? (
          <Text
            style={{
              fontSize: 14,
              color: "#999",
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
                dateRange={formatStartedAt(item.startedAt)}
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
              showNew={isContentNew(item.createdAt)}
              recruitmentMajorNames={resolveRecruitmentMajorDisplayNames(
                item,
                majorsCatalog,
              )}
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
