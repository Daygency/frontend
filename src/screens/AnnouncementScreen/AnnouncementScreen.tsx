import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import FabButton from "../../components/ui/FabButton";
import MajorTagFilter from "../../components/modals/MajorTagFilter";
import SectorTagSelectModal from "../../components/modals/SectorTagSelectModal";
import { RootRoutes } from "../../navigations/routes";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import styles from "./styles";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import {
  getAnnouncementList,
  getMyAnnouncementList,
} from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { useAuth } from "../../contexts/AuthContext";
import { getAnnouncementCategories } from "../../lib/apis/announcement/categoryApi";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import {
  ANNOUNCEMENT_PRICE_FILTER_LABELS,
  selectedPriceLabelsToApiParam,
} from "../../lib/announcement/announcementPrice";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { resolveRecruitmentMajorDisplayNames } from "../../lib/announcement/recruitmentMajors";
import { isContentNew } from "../../lib/content/newBadge";
import { MAIN } from "../../color";

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
  const { isLoggedIn } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "최신순" | "스크랩수순" | "내 공고"
  >("최신순");

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
  const listTabs = ["최신순", "스크랩수순", "내 공고"] as const;

  const [items, setItems] = useState<AnnouncementListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<{ name: string; categoryId: string }[]>([]);
  const [majors, setMajors] = useState<{ name: string; majorId: string }[]>([]);
  const loadListSeqRef = useRef(0);

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
    const priceType = selectedPriceLabelsToApiParam(selectedPriceTypes);
    return { status, categoryId, majorIds, priceType };
  }, [
    selectedStatus,
    selectedTypes,
    selectedMajors,
    selectedPriceTypes,
    categories,
    majors,
  ]);

  const loadData = useCallback(
    async (cursor?: string) => {
      if (activeTab === "내 공고" && !isLoggedIn) {
        setItems([]);
        setNextCursor(null);
        setHasMore(false);
        setLoading(false);
        return;
      }
      const seq = ++loadListSeqRef.current;
      setLoading(true);
      try {
        const { status, categoryId, majorIds, priceType } = buildListParams();
        const params = {
          cursor,
          limit: 20,
          status,
          categoryId,
          majorIds: majorIds || undefined,
          priceType,
        };
        const res =
          activeTab === "내 공고"
            ? await getMyAnnouncementList(params)
            : await getAnnouncementList(params);
        if (seq !== loadListSeqRef.current) return;
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
        if (seq === loadListSeqRef.current) {
          setLoading(false);
        }
      }
    },
    [buildListParams, activeTab, isLoggedIn],
  );

  const loadDataRef = useRef(loadData);
  loadDataRef.current = loadData;

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

  /** 탭·로그인 변경 + 화면 포커스 시에만 자동 조회. 태그 필터는 모달「선택 완료」에서만 loadData 호출 */
  useFocusEffect(
    useCallback(() => {
      loadDataRef.current();
    }, [activeTab, isLoggedIn]),
  );

  const loadMore = () => {
    if (loading || refreshing || !hasMore || !nextCursor) return;
    loadData(nextCursor);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData(undefined);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const typeOptions = categories.length > 0 ? categories.map((c) => c.name) : announcementTypeOptions;
  const majorOptionsForModal = majors.length > 0 ? majors.map((m) => m.name) : recruitmentMajorOptions;

  const emptyMessage =
    activeTab === "내 공고" && !isLoggedIn
      ? "로그인이 필요합니다"
      : activeTab === "내 공고"
        ? "작성한 공고가 없습니다"
        : "모집공고가 없습니다";

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
              ...selectedPriceTypes,
            ]}
            onPress={() => setIsTagModalVisible(true)}
          />
          {listTabs.map((option) => (
            <Pressable
              key={option}
              style={[styles.sortTab, activeTab === option && styles.sortTabActive]}
              onPress={() => setActiveTab(option)}
            >
              <Text
                style={[
                  styles.sortTabText,
                  activeTab === option && styles.sortTabTextActive,
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
          {
            title: "금액 유형",
            options: [...ANNOUNCEMENT_PRICE_FILTER_LABELS],
            selectedValues: selectedPriceTypes,
            onToggle: (value) =>
              setSelectedPriceTypes((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
              ),
          },
        ]}
        onComplete={() => {
          setIsTagModalVisible(false);
          loadDataRef.current();
        }}
      />
      <View style={styles.scrollContentWrapper}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            items.length === 0 && { flexGrow: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={MAIN.DEFAULT}
              colors={[MAIN.DEFAULT]}
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const pad = 100;
            if (
              layoutMeasurement.height + contentOffset.y >= contentSize.height - pad &&
              hasMore &&
              nextCursor &&
              !loading &&
              !refreshing
            ) {
              loadMore();
            }
          }}
          scrollEventThrottle={200}
        >
          {loading && items.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#666" />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{emptyMessage}</Text>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.postId} style={styles.cardWrapper}>
                <AnnouncementCard
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
                    majors,
                  )}
                  onPress={() => {
                    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                      title: item.title,
                      type: item.type,
                      status: item.isRecruiting ? "모집중" : "모집마감",
                      daysLeft: parseAnnouncementDaysLeft(item.dDay),
                      postId: item.postId,
                      viewCount: item.viewCount,
                    });
                  }}
                />
              </View>
            ))
          )}
        </ScrollView>
      </View>
      {!hideTopBar && (
        <FabButton
          menuItems={[
            {
              label: "모집공고",
              onPress: () =>
                navigation.navigate(RootRoutes.ANNOUNCEMENT_REGISTRATION),
            },
            {
              label: "음악계 소식",
              onPress: () =>
                navigation.navigate(RootRoutes.MUSIC_NEWS_REGISTRATION),
            },
            {
              label: "커뮤니티",
              onPress: () =>
                navigation.navigate(RootRoutes.COMMUNITY_REGISTRATION),
            },
          ]}
        />
      )}
    </View>
  );
};

export default AnnouncementScreen;
