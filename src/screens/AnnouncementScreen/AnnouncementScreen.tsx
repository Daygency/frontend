import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import FabButton from "../../components/ui/FabButton";
import EmptyState, { emptyListContentStyle } from "../../components/ui/EmptyState";
import AnnouncementFilterSheet from "./components/AnnouncementFilterSheet";
import {
  ANNOUNCEMENT_SORT_OPTIONS,
  getFilterChipLabel,
  type AnnouncementFilterSheetType,
  type AnnouncementSortOption,
} from "./components/announcementFilterOptions";
import { RootRoutes } from "../../navigations/routes";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import styles from "./styles";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import {
  getAnnouncementList,
  getMyAnnouncementList,
  getMyAppliedAnnouncementList,
} from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import { getAnnouncementCategories } from "../../lib/apis/announcement/categoryApi";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import {
  ANNOUNCEMENT_PRICE_FILTER_LABELS,
  selectedPriceLabelsToApiParam,
} from "../../lib/announcement/announcementPrice";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { resolveRecruitmentMajorDisplayNames } from "../../lib/announcement/recruitmentMajors";
import { resolveAnnouncementAuthorLabel } from "../../lib/announcement/announcementAuthor";
import { isContentNew } from "../../lib/content/newBadge";
import { MAIN, WHITE } from "../../color";

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  AnnouncementRegistration: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AnnouncementFeedView = "전체" | "내가 올린 공고" | "지원공고";

const FEED_VIEW_OPTIONS: AnnouncementFeedView[] = [
  "전체",
  "내가 올린 공고",
  "지원공고",
];

function feedViewRequiresLogin(view: AnnouncementFeedView): boolean {
  return view === "내가 올린 공고" || view === "지원공고";
}

function sortTabToApiParam(tab: AnnouncementSortOption): "imminent" | "created" {
  return tab === "임박순" ? "imminent" : "created";
}

interface AnnouncementScreenProps {
  hideTopBar?: boolean;
}

const AnnouncementScreen = ({ hideTopBar = false }: AnnouncementScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { top } = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([]);
  const [filterSheet, setFilterSheet] = useState<AnnouncementFilterSheetType | null>(
    null,
  );
  const [feedView, setFeedView] = useState<AnnouncementFeedView>("전체");
  const [sortTab, setSortTab] = useState<AnnouncementSortOption>("등록순");

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
      selectedStatus === "모집중"
        ? ("OPEN" as const)
        : selectedStatus === "모집마감"
          ? ("CLOSED" as const)
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
    return {
      status,
      categoryId,
      majorIds,
      priceType,
      sort: sortTabToApiParam(sortTab),
    };
  }, [
    selectedStatus,
    selectedTypes,
    selectedMajors,
    selectedPriceTypes,
    categories,
    majors,
    sortTab,
  ]);

  const loadData = useCallback(
    async (cursor?: string) => {
      if (feedViewRequiresLogin(feedView) && !isLoggedIn) {
        setItems([]);
        setNextCursor(null);
        setHasMore(false);
        setLoading(false);
        return;
      }
      const seq = ++loadListSeqRef.current;
      setLoading(true);
      try {
        const { status, categoryId, majorIds, priceType, sort } = buildListParams();
        const params = {
          cursor,
          limit: 20,
          status,
          categoryId,
          majorIds: majorIds || undefined,
          priceType,
          sort,
        };
        const res =
          feedView === "내가 올린 공고"
            ? await getMyAnnouncementList(params)
            : feedView === "지원공고"
              ? await getMyAppliedAnnouncementList(params)
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
    [buildListParams, feedView, isLoggedIn],
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

  useEffect(() => {
    setFilterSheet(null);
  }, [feedView, sortTab]);

  /** 탭·로그인 변경 + 화면 포커스 시에만 자동 조회. 태그 필터는 시트 닫을 때 loadData 호출 */
  useFocusEffect(
    useCallback(() => {
      loadDataRef.current();
    }, [feedView, isLoggedIn, sortTab]),
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

  const filterSheetConfig: Record<
    AnnouncementFilterSheetType,
    { options: string[]; selectedValues: string[]; onToggle: (value: string) => void }
  > = {
    feed: {
      options: [...FEED_VIEW_OPTIONS],
      selectedValues: feedView === "전체" ? [] : [feedView],
      onToggle: (value) => {
        const next = value as AnnouncementFeedView;
        if (feedViewRequiresLogin(next) && !ensureLoggedIn()) return;
        setFeedView(next);
      },
    },
    sort: {
      options: [...ANNOUNCEMENT_SORT_OPTIONS],
      selectedValues: [sortTab],
      onToggle: (value) => setSortTab(value as AnnouncementSortOption),
    },
    status: {
      options: recruitmentStatusOptions,
      selectedValues: selectedStatus ? [selectedStatus] : [],
      onToggle: (value) =>
        setSelectedStatus((prev) => (prev === value ? null : value)),
    },
    type: {
      options: typeOptions,
      selectedValues: selectedTypes,
      onToggle: (value) =>
        setSelectedTypes((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        ),
    },
    major: {
      options: majorOptionsForModal,
      selectedValues: selectedMajors,
      onToggle: (value) =>
        setSelectedMajors((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        ),
    },
    price: {
      options: [...ANNOUNCEMENT_PRICE_FILTER_LABELS],
      selectedValues: selectedPriceTypes,
      onToggle: (value) =>
        setSelectedPriceTypes((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        ),
    },
  };

  const filterChips: {
    type: AnnouncementFilterSheetType;
    defaultLabel: string;
    selectedValues: string[];
  }[] = [
    { type: "feed", defaultLabel: "공고 보기", selectedValues: feedView === "전체" ? [] : [feedView] },
    { type: "sort", defaultLabel: "정렬", selectedValues: [sortTab] },
    { type: "status", defaultLabel: "모집 상태", selectedValues: selectedStatus ? [selectedStatus] : [] },
    { type: "type", defaultLabel: "공고 유형", selectedValues: selectedTypes },
    { type: "major", defaultLabel: "모집 전공", selectedValues: selectedMajors },
    { type: "price", defaultLabel: "금액 유형", selectedValues: selectedPriceTypes },
  ];

  const closeFilterSheet = () => {
    setFilterSheet(null);
    loadDataRef.current();
  };

  const emptyMessage =
    feedViewRequiresLogin(feedView) && !isLoggedIn
      ? "로그인이 필요합니다"
      : feedView === "내가 올린 공고"
        ? "작성한 공고가 없습니다"
        : feedView === "지원공고"
          ? "지원한 공고가 없습니다"
          : "모집공고가 없습니다";

  return (
    <View style={[styles.container, { paddingTop: hideTopBar ? 0 : top }]}>
      {!hideTopBar && (
        <MainHomeTopBar logoName="모집공고" initialTag="모집공고" />
      )}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipRow}
          contentContainerStyle={styles.filterChipRowContent}
        >
          {filterChips.map((chip) => {
            const isActive =
              chip.type === "sort" ||
              chip.selectedValues.length > 0;
            return (
              <Pressable
                key={chip.type}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilterSheet(chip.type)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {getFilterChipLabel(chip.defaultLabel, chip.selectedValues)}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={16}
                  color={isActive ? WHITE : MAIN.DEFAULT}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {filterSheet ? (
        <AnnouncementFilterSheet
          type={filterSheet}
          options={filterSheetConfig[filterSheet].options}
          selectedValues={filterSheetConfig[filterSheet].selectedValues}
          onToggle={filterSheetConfig[filterSheet].onToggle}
          onClose={closeFilterSheet}
        />
      ) : null}
      <View style={styles.scrollContentWrapper}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            items.length === 0 && emptyListContentStyle,
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
            <EmptyState message={emptyMessage} />
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
                  authorName={resolveAnnouncementAuthorLabel(item.user)}
                  profileImgUrl={item.user?.profileImgUrl}
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
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.ANNOUNCEMENT_REGISTRATION);
              },
            },
            {
              label: "공연 소식",
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.MUSIC_NEWS_REGISTRATION);
              },
            },
            {
              label: "커뮤니티",
              onPress: () => {
                if (!ensureLoggedIn()) return;
                navigation.navigate(RootRoutes.COMMUNITY_REGISTRATION);
              },
            },
          ]}
        />
      )}
    </View>
  );
};

export default AnnouncementScreen;
