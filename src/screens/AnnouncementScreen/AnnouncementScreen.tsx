import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
import { getAnnouncementList } from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { getAnnouncementCategories } from "../../lib/apis/announcement/categoryApi";
import { getMajors } from "../../lib/apis/announcement/majorApi";

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

  const [items, setItems] = useState<AnnouncementListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ name: string; categoryId: string }[]>([]);
  const [majors, setMajors] = useState<{ name: string; majorId: string }[]>([]);

  const buildListParams = useCallback(() => {
    const status =
      selectedStatus.length === 1
        ? selectedStatus[0] === "모집중"
          ? ("OPEN" as const)
          : selectedStatus[0] === "모집마감"
            ? ("CLOSED" as const)
            : undefined
        : undefined;
    const categoryId =
      selectedTypes.length > 0
        ? categories.find((c) => c.name === selectedTypes[0])?.categoryId
        : undefined;
    // 전공무관: majorIds 생략 시 전체 조회 (API 스펙)
    const majorIds =
      selectedMajors.length > 0 && !selectedMajors.includes("전공무관")
        ? selectedMajors
            .map((name) => majors.find((m) => m.name === name)?.majorId)
            .filter(Boolean)
            .join(",")
        : undefined;
    return { status, categoryId, majorIds };
  }, [selectedStatus, selectedTypes, selectedMajors, categories, majors]);

  const loadData = useCallback(
    async (cursor?: string) => {
      setLoading(true);
      try {
        const { status, categoryId, majorIds } = buildListParams();
        const res = await getAnnouncementList({
          cursor,
          limit: 20,
          status,
          categoryId,
          majorIds: majorIds || undefined,
        });
        if (!res) {
          setItems([]);
          setNextCursor(null);
          setHasMore(false);
          return;
        }
        if (!cursor) {
          setItems(res.items ?? []);
        } else {
          setItems((prev) => [...prev, ...(res.items ?? [])]);
        }
        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore ?? false);
      } finally {
        setLoading(false);
      }
    },
    [buildListParams],
  );

  useEffect(() => {
    getAnnouncementCategories().then((list) => {
      setCategories(
        list.map((c) => ({
          name: c.name,
          categoryId: (c as { categoryId?: string }).categoryId ?? (c as { id?: string }).id ?? "",
        })),
      );
    });
    getMajors().then((list) => {
      setMajors(
        list.map((m) => ({
          name: m.name,
          majorId: (m as { majorId?: string }).majorId ?? (m as { id?: string }).id ?? "",
        })),
      );
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 삭제/수정 후 돌아왔을 때 목록 최신화
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const loadMore = () => {
    if (loading || !hasMore || !nextCursor) return;
    loadData(nextCursor);
  };

  const typeOptions = categories.length > 0 ? categories.map((c) => c.name) : announcementTypeOptions;
  const majorOptionsForModal = majors.length > 0 ? majors.map((m) => m.name) : recruitmentMajorOptions;

  const parseDaysLeft = (dDay: string): number => {
    const m = dDay.match(/D-?(\d+)/);
    return m ? Number(m[1]) : 0;
  };

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
            options: typeOptions,
            selectedValues: selectedTypes,
            onToggle: (value) =>
              setSelectedTypes((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
          {
            title: "모집 전공",
            options: majorOptionsForModal,
            selectedValues: selectedMajors,
            onToggle: (value) =>
              setSelectedMajors((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
        ]}
        onComplete={() => {
          setIsTagModalVisible(false);
          loadData();
        }}
      />
      <View style={styles.scrollContentWrapper}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#666" />
          </View>
        ) : items.length === 0 ? (
          <View style={[styles.scrollContent, styles.emptyState]}>
            <Text style={styles.emptyStateText}>모집공고가 없습니다</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
              const pad = 100;
              if (layoutMeasurement.height + contentOffset.y >= contentSize.height - pad && hasMore && nextCursor && !loading) {
                loadMore();
              }
            }}
            scrollEventThrottle={200}
          >
            {items.map((item) => (
              <View key={item.postId} style={styles.cardWrapper}>
                <AnnouncementCard
                  title={item.title}
                  type={item.type}
                  status={item.isRecruiting ? "모집중" : "모집마감"}
                  daysLeft={parseDaysLeft(item.dDay)}
                  onPress={() => {
                    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                      title: item.title,
                      type: item.type,
                      status: item.isRecruiting ? "모집중" : "모집마감",
                      daysLeft: parseDaysLeft(item.dDay),
                      postId: item.postId,
                    });
                  }}
                />
              </View>
            ))}
          </ScrollView>
        )}
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
