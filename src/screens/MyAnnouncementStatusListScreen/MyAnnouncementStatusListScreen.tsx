import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementMyPostRow from "../AnnouncementScreen/components/AnnouncementMyPostRow";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import MainHomeHeader from "../../components/layout/MainHomeHeader";
import { RootRoutes } from "../../navigations/routes";
import { getMyAnnouncementList } from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListParams } from "../../lib/apis/announcement/types";
import {
  getAnnouncementApplicantSummary,
  type AnnouncementApplicantSummary,
} from "../../lib/application/announcementApplicantSummary";
import { announcementListRecruitmentStatus } from "../../lib/announcement/announcementListStatus";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { useCursorAnnouncementTabs } from "../../lib/announcement/useCursorAnnouncementTabs";
import { MAIN } from "../../color";
import styles from "./styles";

export const MY_ANNOUNCEMENT_STATUS_TABS = ["모집중", "모집마감", "종료"] as const;
export type MyAnnouncementStatusTab = (typeof MY_ANNOUNCEMENT_STATUS_TABS)[number];

export type MyAnnouncementStatusListParams = {
  initialTab: MyAnnouncementStatusTab;
  /** "내 활동" 요약 화면에서 넘겨준 초기 개수 (탭 라벨 표시용, 실제 목록은 커서 기반으로 다시 조회) */
  counts?: Partial<Record<MyAnnouncementStatusTab, number>>;
};

type RootStackParamList = {
  MyAnnouncementStatusList: MyAnnouncementStatusListParams;
  AnnouncementApplicants: { postId: string; title: string };
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    postedDate?: string;
    viewCount?: number;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type MyAnnouncementStatusListRouteProp = RouteProp<
  RootStackParamList,
  "MyAnnouncementStatusList"
>;

function paramsForTab(tab: MyAnnouncementStatusTab): AnnouncementListParams {
  switch (tab) {
    case "모집중":
      return { status: "OPEN", completed: false };
    case "모집마감":
      return { status: "CLOSED", completed: false };
    case "종료":
      return { completed: true };
  }
}

const MyAnnouncementStatusListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MyAnnouncementStatusListRouteProp>();
  const counts = route.params?.counts;
  const [activeTab, setActiveTab] = useState<MyAnnouncementStatusTab>(
    route.params?.initialTab ?? "모집중",
  );
  const { items, loading, loadingMore, hasMore, refreshing, loadMore, onRefresh } =
    useCursorAnnouncementTabs(
      MY_ANNOUNCEMENT_STATUS_TABS,
      activeTab,
      paramsForTab,
      getMyAnnouncementList,
    );

  const [applicantSummaries, setApplicantSummaries] = useState<
    Record<string, AnnouncementApplicantSummary | null>
  >({});

  useEffect(() => {
    const pending = items.filter((item) => !(item.postId in applicantSummaries));
    if (pending.length === 0) return;
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        pending.map((item) => getAnnouncementApplicantSummary(item.postId)),
      );
      if (cancelled) return;
      setApplicantSummaries((prev) => {
        const next = { ...prev };
        pending.forEach((item, index) => {
          next[item.postId] = results[index];
        });
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const tabOptions = MY_ANNOUNCEMENT_STATUS_TABS.map((tab) => ({
    tab,
    label:
      counts?.[tab] != null ? `${tab} (${counts[tab]})` : tab,
  }));

  return (
    <View style={styles.container}>
      <MainHomeHeader
        tabs={tabOptions.map((option) => option.label)}
        activeTab={tabOptions.find((option) => option.tab === activeTab)?.label ?? ""}
        onTabChange={(label) => {
          const found = tabOptions.find((option) => option.label === label);
          if (found) setActiveTab(found.tab);
        }}
      />
      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={MAIN.DEFAULT} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.postId}
          contentContainerStyle={contentContainerWhenEmpty(
            items.length === 0,
            styles.listContent,
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => {
            const status = announcementListRecruitmentStatus(item);
            return (
              <View style={styles.cardWrapper}>
                <AnnouncementMyPostRow
                  title={item.title}
                  status={status}
                  type={item.type}
                  createdAt={item.createdAt}
                  completed={item.completed}
                  summary={applicantSummaries[item.postId] ?? null}
                  onPress={() =>
                    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                      postId: item.postId,
                      title: item.title,
                      type: item.type,
                      status,
                      daysLeft: parseAnnouncementDaysLeft(item.dDay),
                      postedDate: item.createdAt,
                      viewCount: item.viewCount,
                    })
                  }
                  onPressApplicants={() =>
                    navigation.navigate(RootRoutes.ANNOUNCEMENT_APPLICANTS, {
                      postId: item.postId,
                      title: item.title,
                    })
                  }
                />
              </View>
            );
          }}
          ListFooterComponent={
            loadingMore && hasMore ? (
              <ActivityIndicator style={styles.footerLoader} color={MAIN.DEFAULT} />
            ) : null
          }
          ListEmptyComponent={<EmptyState message="해당 상태의 공고가 없습니다." />}
        />
      )}
    </View>
  );
};

export default MyAnnouncementStatusListScreen;
