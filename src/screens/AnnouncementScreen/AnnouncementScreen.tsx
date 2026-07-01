import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import { ContentRegistrationFabButton } from "../../components/ui/FabButton";
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
import { announcementListRecruitmentStatus } from "../../lib/announcement/announcementListStatus";
import { resolveAnnouncementAuthorLabel } from "../../lib/announcement/announcementAuthor";
import { isContentNew } from "../../lib/content/newBadge";
import { MAIN, WHITE } from "../../color";
import {
  AnnouncementScrollProvider,
  useAnnouncementScroll,
} from "./AnnouncementScrollContext";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  AnnouncementRegistration: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AnnouncementFeedView = "전체" | "내가 올린 공고" | "지원한 공고";
type AnnouncementRouteParams = { initialFeedView?: AnnouncementFeedView };

const FEED_VIEW_OPTIONS: AnnouncementFeedView[] = [
  "전체",
  "내가 올린 공고",
  "지원한 공고",
];

function feedViewRequiresLogin(view: AnnouncementFeedView): boolean {
  return view === "내가 올린 공고" || view === "지원한 공고";
}

function sortTabToApiParam(tab: AnnouncementSortOption): "imminent" | "created" {
  return tab === "임박순" ? "imminent" : "created";
}

interface AnnouncementScreenProps {
  hideTopBar?: boolean;
}

type AnnouncementListBodyProps = {
  items: AnnouncementListItem[];
  loading: boolean;
  refreshing: boolean;
  emptyMessage: string;
  onRefresh: () => void;
  onPressItem: (item: AnnouncementListItem) => void;
};

function AnnouncementListContent({
  items,
  loading,
  refreshing,
  emptyMessage,
  onPressItem,
}: AnnouncementListBodyProps) {
  if (loading && !refreshing && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {items.map((item) => (
        <View key={item.postId} style={styles.cardWrapper}>
          <AnnouncementCard
            title={item.title}
            type={item.type}
            status={announcementListRecruitmentStatus(item)}
            daysLeft={parseAnnouncementDaysLeft(item.dDay)}
            deadlineAt={item.deadlineAt}
            completed={item.completed}
            viewCount={item.viewCount}
            priceType={item.priceType}
            price={item.price}
            address={item.address}
            authorName={resolveAnnouncementAuthorLabel(item.user)}
            profileImgUrl={item.user?.profileImgUrl}
            showNew={isContentNew(item.createdAt)}
            onPress={() => onPressItem(item)}
          />
        </View>
      ))}
    </>
  );
}

const CollapsibleAnnouncementList = ({
  items,
  loading,
  refreshing,
  emptyMessage,
  onRefresh,
  onPressItem,
}: AnnouncementListBodyProps) => {
  const { listTopInset, scrollHandler } = useAnnouncementScroll();

  return (
    <View style={styles.scrollContentWrapper}>
      <AnimatedScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: listTopInset },
          items.length === 0 && emptyListContentStyle,
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN.DEFAULT}
            colors={[MAIN.DEFAULT]}
            progressViewOffset={listTopInset}
          />
        }
      >
        <AnnouncementListContent
          items={items}
          loading={loading}
          refreshing={refreshing}
          emptyMessage={emptyMessage}
          onRefresh={onRefresh}
          onPressItem={onPressItem}
        />
      </AnimatedScrollView>
    </View>
  );
};

const PlainAnnouncementList = ({
  items,
  loading,
  refreshing,
  emptyMessage,
  onRefresh,
  onScrollForPagination,
  onPressItem,
}: AnnouncementListBodyProps & {
  onScrollForPagination: (event: NativeScrollEvent) => void;
}) => (
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
      onScroll={({ nativeEvent }) => onScrollForPagination(nativeEvent)}
      scrollEventThrottle={200}
    >
      <AnnouncementListContent
        items={items}
        loading={loading}
        refreshing={refreshing}
        emptyMessage={emptyMessage}
        onRefresh={onRefresh}
        onPressItem={onPressItem}
      />
    </ScrollView>
  </View>
);

const AnnouncementScreen = ({ hideTopBar = false }: AnnouncementScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<{ key: string; name: string; params?: AnnouncementRouteParams }>();
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
  const [feedView, setFeedView] = useState<AnnouncementFeedView>(
    route.params?.initialFeedView ?? "전체",
  );
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
    async (cursor?: string, options?: { refresh?: boolean }) => {
      const isRefresh = options?.refresh ?? false;
      const isLoadMore = Boolean(cursor);

      if (feedViewRequiresLogin(feedView) && !isLoggedIn) {
        setItems([]);
        setNextCursor(null);
        setHasMore(false);
        setLoading(false);
        return;
      }
      const seq = ++loadListSeqRef.current;
      if (!isLoadMore && !isRefresh) {
        setLoading(true);
      }
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
            : feedView === "지원한 공고"
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
        if (!isLoadMore && !isRefresh && seq === loadListSeqRef.current) {
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

  useEffect(() => {
    const nextFeedView = route.params?.initialFeedView;
    if (!nextFeedView) return;
    if (feedViewRequiresLogin(nextFeedView) && !isLoggedIn) {
      if (!ensureLoggedIn()) return;
    }
    setFeedView(nextFeedView);
  }, [ensureLoggedIn, isLoggedIn, route.params?.initialFeedView]);

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
      await loadData(undefined, { refresh: true });
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
        : feedView === "지원한 공고"
          ? "지원한 공고가 없습니다"
          : "모집공고가 없습니다";

  const handlePressItem = useCallback(
    (item: AnnouncementListItem) => {
      navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
        title: item.title,
        type: item.type,
        status: announcementListRecruitmentStatus(item),
        daysLeft: parseAnnouncementDaysLeft(item.dDay),
        postId: item.postId,
        viewCount: item.viewCount,
      });
    },
    [navigation],
  );

  const handlePaginationScroll = useCallback(
    (event: NativeScrollEvent) => {
      const { layoutMeasurement, contentOffset, contentSize } = event;
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
    },
    [hasMore, nextCursor, loading, refreshing],
  );

  const filterBar = (
    <View style={styles.filterWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipRow}
        contentContainerStyle={styles.filterChipRowContent}
      >
        {filterChips.map((chip) => {
          const isActive =
            chip.type === "sort" || chip.selectedValues.length > 0;
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
  );

  const listProps = {
    items,
    loading,
    refreshing,
    emptyMessage,
    onRefresh,
    onPressItem: handlePressItem,
  };

  if (hideTopBar) {
    return (
      <View style={styles.container}>
        {filterBar}
        {filterSheet ? (
          <AnnouncementFilterSheet
            type={filterSheet}
            options={filterSheetConfig[filterSheet].options}
            selectedValues={filterSheetConfig[filterSheet].selectedValues}
            onToggle={filterSheetConfig[filterSheet].onToggle}
            onClose={closeFilterSheet}
          />
        ) : null}
        <PlainAnnouncementList
          {...listProps}
          onScrollForPagination={handlePaginationScroll}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <AnnouncementScrollProvider
        topBar={
          <MainHomeTopBar logoName="모집공고" initialTag="모집공고" />
        }
        filterBar={filterBar}
        onScrollForPagination={handlePaginationScroll}
      >
        <CollapsibleAnnouncementList {...listProps} />
      </AnnouncementScrollProvider>
      {filterSheet ? (
        <AnnouncementFilterSheet
          type={filterSheet}
          options={filterSheetConfig[filterSheet].options}
          selectedValues={filterSheetConfig[filterSheet].selectedValues}
          onToggle={filterSheetConfig[filterSheet].onToggle}
          onClose={closeFilterSheet}
        />
      ) : null}
      <ContentRegistrationFabButton />
    </View>
  );
};

export default AnnouncementScreen;
