import { Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementCard from "../../components/AnnouncementCard/AnnouncementCard";
import FabButton from "../../components/FabButton/FabButton";
import MajorTagFilter from "../../components/MajorTagFilter/MajorTagFilter";
import SectorTagSelectModal from "../../components/SectorTagSelectModal/SectorTagSelectModal";
import { RootRoutes } from "../../navigations/routes";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import styles from "./styles";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  AnnouncementRegistration: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AnnouncementScreenProps {
  hideTopBar?: boolean;
}

const AnnouncementScreen = ({ hideTopBar = false }: AnnouncementScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { top } = useSafeAreaInsets();
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
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
    <View style={[styles.container, { paddingTop: hideTopBar ? 0 : top }]}>
      {!hideTopBar && <MainHomeTopBar logoName="모집공고" initialTag="모집공고" />}
      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          <MajorTagFilter
            label="태그"
            selectedValues={[
              ...selectedStatus,
              ...selectedTypes,
              ...selectedMajors,
            ]}
            onPress={() => setIsTagModalVisible(true)}
          />
          {sortOptions.map((option) => (
            <Pressable
              key={option}
              style={[styles.sortTab, sortBy === option && styles.sortTabActive]}
              onPress={() => setSortBy(option)}
            >
              <Text
                style={[
                  styles.sortTabText,
                  sortBy === option && styles.sortTabTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <SectorTagSelectModal
        visible={isTagModalVisible}
        title="태그 선택"
        sections={[
          {
            title: "모집 상태",
            options: recruitmentStatusOptions,
            selectedValues: selectedStatus,
            onToggle: (value) =>
              setSelectedStatus((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
          {
            title: "공고 유형",
            options: announcementTypeOptions,
            selectedValues: selectedTypes,
            onToggle: (value) =>
              setSelectedTypes((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
          {
            title: "모집 전공",
            options: recruitmentMajorOptions,
            selectedValues: selectedMajors,
            onToggle: (value) =>
              setSelectedMajors((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
        ]}
        onComplete={() => setIsTagModalVisible(false)}
      />
      <View style={styles.scrollContentWrapper}>
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
      {!hideTopBar && (
        <FabButton
          onPress={() => navigation.navigate(RootRoutes.ANNOUNCEMENT_REGISTRATION)}
        />
      )}
    </View>
  );
};

export default AnnouncementScreen;
