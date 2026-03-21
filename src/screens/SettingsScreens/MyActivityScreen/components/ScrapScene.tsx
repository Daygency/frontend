import { useState } from "react";
import {
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
import FilterDropdown from "../../../../components/FilterDropdown/FilterDropdown";
import AnnouncementCard from "../../../../components/AnnouncementCard/AnnouncementCard";
import styles from "../styles";

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

const MOCK_SCRAP_ANNOUNCEMENTS = [
  {
    title: "교향악단 바이올린 객원단원 채용",
    type: "오디션(연주자 모집)",
    status: "모집중",
    daysLeft: 20,
  },
  {
    title: "2025 서울 국제 피아노 콩쿨 모집",
    type: "콩쿨(경연)",
    status: "모집중",
    daysLeft: 15,
  },
  {
    title: "오케스트라 단원 모집 공고",
    type: "오디션",
    status: "모집중",
    daysLeft: 8,
  },
];

type RootStackParamList = {
  MyActivityList: { type: "posts"; source?: "scrap" };
  MyActivityNewsList: { source?: "scrap" };
  AnnouncementDetail: { title: string; type: string; status: string; daysLeft: number };
};

const ScrapScene = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<ScrapTab>("라운지");
  const [recruitmentStatus, setRecruitmentStatus] = useState<string | undefined>();
  const [announcementType, setAnnouncementType] = useState<string | undefined>();
  const [recruitmentMajor, setRecruitmentMajor] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("최신순");

  const recruitmentStatusOptions = ["모집중", "모집마감"];
  const announcementTypeOptions = [
    "오디션(연주자모집)",
    "콩쿨(경연)",
    "입시평가회",
    "마스터클래스",
    "행사",
    "스탭구인",
    "기타",
  ];
  const recruitmentMajorOptions = [
    "전공무관",
    "건반악기",
    "현악",
    "관악",
    "성악",
    "타악",
    "작곡",
    "지휘",
    "음악학",
    "국악",
    "무용",
    "실용",
    "뮤지컬·크로스오버",
    "기타",
  ];
  const sortOptions = ["최신순", "스크랩수순"];

  const handlePressScrapCommunity = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_LIST, {
      type: "posts",
      source: "scrap",
    });
  };

  const handlePressScrapNews = () => {
    navigation.navigate(RootRoutes.MY_ACTIVITY_NEWS_LIST, { source: "scrap" });
  };

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.filterContainer}
        nestedScrollEnabled
        directionalLockEnabled
        scrollEventThrottle={16}
        bounces={false}
        style={localStyles.filterScrollView}
      >
        <FilterDropdown
          label="모집 상태"
          options={recruitmentStatusOptions}
          selectedValue={recruitmentStatus}
          onSelect={setRecruitmentStatus}
        />
        <FilterDropdown
          label="공고 유형"
          options={announcementTypeOptions}
          selectedValue={announcementType}
          onSelect={setAnnouncementType}
        />
        <FilterDropdown
          label="모집 전공"
          options={recruitmentMajorOptions}
          selectedValue={recruitmentMajor}
          onSelect={setRecruitmentMajor}
        />
        <FilterDropdown
          label="정렬"
          options={sortOptions}
          selectedValue={sortBy}
          onSelect={setSortBy}
        />
      </ScrollView>
      <ScrollView
        style={localStyles.announcementListScroll}
        contentContainerStyle={localStyles.announcementScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_SCRAP_ANNOUNCEMENTS.length > 0 ? (
          MOCK_SCRAP_ANNOUNCEMENTS.map((announcement, index) => (
            <View key={index} style={localStyles.cardWrapper}>
              <AnnouncementCard
                title={announcement.title}
                type={announcement.type}
                status={announcement.status}
                daysLeft={announcement.daysLeft}
                onPress={() => {
                  navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                    title: announcement.title,
                    type: announcement.type,
                    status: announcement.status,
                    daysLeft: announcement.daysLeft,
                  });
                }}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>스크랩한 모집공고가 없습니다.</Text>
          </View>
        )}
      </ScrollView>
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 9,
    gap: 8,
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
    marginBottom: 5,
  },
});

export default ScrapScene;
