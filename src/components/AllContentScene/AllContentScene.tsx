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
import EventScheduleCard from "../EventScheduleCard/EventScheduleCard";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { ContentRoutes } from "../../navigations/routes";
import { RootRoutes } from "../../navigations/routes";
import { getAnnouncementList } from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { getNewsList } from "../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../lib/apis/news/types";

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

const DEFAULT_NEWS_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s";

const AllContentScene = () => {
  const navigation = useNavigation<NavigationProp>();
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsListItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

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
          <Text style={{ fontSize: 14, color: "#999", paddingVertical: 24, paddingHorizontal: 12 }}>공연소식이 없습니다</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: NEWS_CARD_GAP,
              paddingHorizontal: 12,
              paddingRight: 12,
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
                imageUrl={item.imageUrl || DEFAULT_NEWS_IMAGE_URL}
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
          (navigation as { navigate: (a: string, b?: object) => void }).navigate(
            "ContentTab",
            { screen: ContentRoutes.CHAT },
          );
        }}
      >
        <GrayCard
          items={[
            {
              boardName: "자유게시판",
              latestPost: "공연 무사히 마무리했습니다!",
              hasNew: true,
            },
            {
              boardName: "강사·대타구인",
              latestPost: "00월 00일 스탭 구합니다.",
            },
            { boardName: "입시 정보", latestPost: "입시 정보 공유해주세요!" },
            { boardName: "유학 정보", latestPost: "유학 질문 드립니다." },
            {
              boardName: "학원 운영",
              latestPost: "학원을 운영하려고 하는데 도움이 필요합니다!",
            },
            {
              boardName: "학원·연습실",
              latestPost: "연습실 내놓습니다.",
            },
          ]}
        />
      </Section>
      <Section title="내 공연 일정" onPressMore={() => {}}>
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
      </Section>
    </ScrollView>
  );
};

export default AllContentScene;
