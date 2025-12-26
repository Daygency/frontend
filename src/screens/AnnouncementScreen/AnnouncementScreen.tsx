import { ScrollView, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import { RootRoutes } from "../../navigations/routes";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import styles from "./styles";
import MainHomeHeader from "../../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../components/MainHomeTopBar/styles";

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnnouncementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { top } = useSafeAreaInsets();
  const [recruitmentStatus, setRecruitmentStatus] = useState<
    string | undefined
  >();
  const [announcementType, setAnnouncementType] = useState<
    string | undefined
  >();
  const [recruitmentMajor, setRecruitmentMajor] = useState<
    string | undefined
  >();
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

  const announcements = [
    {
      title: "교향악단 바이올린 객원단원 채용",
      type: "오디션(연주자 모집)",
      status: "모집중",
      daysLeft: 20,
    },
    {
      title: "교향악단 바이올린 객원단원 채용",
      type: "콩쿨(경연)",
      status: "모집중",
      daysLeft: 20,
    },
    {
      title: "교향악단 바이올린 객원단원 채용",
      type: "입시평가회",
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
    {
      title: "뮤지컬 배우 오디션",
      type: "오디션",
      status: "모집중",
      daysLeft: 22,
    },
    {
      title: "재즈 밴드 멤버 모집",
      type: "밴드",
      status: "모집중",
      daysLeft: 5,
    },
    { title: "합창단 단원 모집", type: "합창", status: "모집중", daysLeft: 30 },
    {
      title: "바이올린 마스터클래스 참가자 모집",
      type: "마스터클래스",
      status: "모집중",
      daysLeft: 12,
    },
    {
      title: "플루트 연주자 모집",
      type: "오디션",
      status: "모집중",
      daysLeft: 18,
    },
    { title: "드럼 연주자 모집", type: "밴드", status: "모집중", daysLeft: 7 },
    {
      title: "첼로 연주자 모집",
      type: "오디션",
      status: "모집중",
      daysLeft: 25,
    },
    {
      title: "클래식 기타 콩쿨",
      type: "콩쿨(경연)",
      status: "모집중",
      daysLeft: 10,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar logoName="모집공고" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        scrollEventThrottle={16}
        bounces={false}
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {announcements.map((announcement, index) => (
          <View key={index} style={styles.cardWrapper}>
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
        ))}
      </ScrollView>
    </View>
  );
};

export default AnnouncementScreen;
