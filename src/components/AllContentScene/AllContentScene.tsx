import { ActivityIndicator, ScrollView, Text, View } from "react-native";

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
import { ContentRoutes } from "../../navigations/routes";
import { RootRoutes } from "../../navigations/routes";
import { getAnnouncementList } from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { getNewsList } from "../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../lib/apis/news/types";
import {
  getCommunityCategories,
  getCommunityList,
} from "../../lib/apis/community/communityApi";
import type { CommunityCategory, CommunityListItem } from "../../lib/apis/community/types";
import { pickNewsListThumbnailUrl } from "../../lib/media/listThumbnailUrl";

type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]: undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

type NavigationProp = BottomTabNavigationProp<ContentTabParamList>;

function parseDaysLeft(dDay: string): number {
  const m = dDay.match(/D-?(\d+)/);
  return m ? Number(m[1]) : 0;
}

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

type HomeCommunityBoardConfig = {
  boardName: string;
  categoryName: string;
};

const HOME_COMMUNITY_BOARDS: HomeCommunityBoardConfig[] = [
  { boardName: "자유게시판", categoryName: "자유게시판" },
  { boardName: "강사·대타구인", categoryName: "구인" },
  { boardName: "입시 정보", categoryName: "입시정보" },
  { boardName: "유학 정보", categoryName: "유학정보" },
  { boardName: "학원 운영", categoryName: "학원운용" },
  { boardName: "학원·연습실", categoryName: "학원/연습실 매매" },
];

const AllContentScene = () => {
  const navigation = useNavigation<NavigationProp>();
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsListItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [communityBoards, setCommunityBoards] = useState<
    { boardName: string; latestPost: string; hasNew?: boolean }[]
  >([]);
  const [communityLoading, setCommunityLoading] = useState(true);

  useEffect(() => {
    getAnnouncementList({ limit: 5 }).then((res) => {
      setAnnouncementsLoading(false);
      if (res?.items) setAnnouncements(res.items);
    });
  }, []);

  useEffect(() => {
    getNewsList({ limit: 5 }).then((res) => {
      setNewsLoading(false);
      if (res?.items) setNewsItems(res.items);
    });
  }, []);

  useEffect(() => {
    (async () => {
      setCommunityLoading(true);
      try {
        const categories = (await getCommunityCategories()) ?? [];
        const categoryIdByName = new Map<string, string>(
          categories.map((c: CommunityCategory) => [c.name, c.categoryId])
        );

        const results = await Promise.all(
          HOME_COMMUNITY_BOARDS.map(async (cfg) => {
            const categoryId = categoryIdByName.get(cfg.categoryName);
            if (!categoryId) {
              return { boardName: cfg.boardName, latestPost: "글이 없습니다." };
            }

            const list = await getCommunityList({ categoryId });
            const safeList: CommunityListItem[] = Array.isArray(list) ? list : [];
            if (safeList.length === 0) {
              return { boardName: cfg.boardName, latestPost: "글이 없습니다." };
            }

            const latest = [...safeList].sort((a, b) => {
              const at = new Date(a.createdAt).getTime();
              const bt = new Date(b.createdAt).getTime();
              return (isNaN(bt) ? 0 : bt) - (isNaN(at) ? 0 : at);
            })[0];

            return {
              boardName: cfg.boardName,
              latestPost: latest?.title ? String(latest.title) : "글이 없습니다.",
            };
          })
        );

        setCommunityBoards(results);
      } finally {
        setCommunityLoading(false);
      }
    })();
  }, []);

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

  return (
    <ScrollView>
      <ImageCarousel width={339} height={183} gap={5} />
      <Section title="모집공고" onPressMore={handleAnnouncementMore}>
        {announcementsLoading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        ) : announcements.length === 0 ? (
          <Text style={{ fontSize: 14, color: "#999", paddingVertical: 24 }}>모집공고가 없습니다</Text>
        ) : (
          announcements.slice(0, 5).map((item) => (
            <AnnouncementCard
              key={item.postId}
              title={item.title}
              type={item.type}
              status={item.isRecruiting ? "모집중" : "모집마감"}
              daysLeft={parseDaysLeft(item.dDay)}
              onPress={() => {
                (navigation as { navigate: (a: string, b?: object) => void }).navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                  title: item.title,
                  type: item.type,
                  status: item.isRecruiting ? "모집중" : "모집마감",
                  daysLeft: parseDaysLeft(item.dDay),
                  postId: item.postId,
                });
              }}
            />
          ))
        )}
      </Section>
      <Section title="공연소식" onPressMore={handleNewsMore} styles={{ content: { paddingHorizontal: 0 } }}>
        {newsLoading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        ) : newsItems.length === 0 ? (
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
                imageUrl={pickNewsListThumbnailUrl(item)}
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
      <Section
        title="커뮤니티"
        onPressMore={() => {
          // 이미 ContentTab 내부라 탭으로 직접 이동하는 게 가장 확실합니다.
          (navigation as any).navigate(ContentRoutes.CHAT, { initialTab: "커뮤니티" });
        }}
      >
        {communityLoading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        ) : (
          <GrayCard
            items={
              communityBoards.length > 0
                ? communityBoards
                : HOME_COMMUNITY_BOARDS.map((b) => ({
                    boardName: b.boardName,
                    latestPost: "글이 없습니다.",
                  }))
            }
          />
        )}
      </Section>
    </ScrollView>
  );
};

export default AllContentScene;
