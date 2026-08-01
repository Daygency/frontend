import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import MainHomeHeader from "../../components/layout/MainHomeHeader";
import { RootRoutes } from "../../navigations/routes";
import { getMyAppliedAnnouncementList } from "../../lib/apis/announcement/announcementApi";
import type { AnnouncementListParams } from "../../lib/apis/announcement/types";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { announcementListRecruitmentStatus } from "../../lib/announcement/announcementListStatus";
import { resolveAnnouncementAuthorLabel } from "../../lib/announcement/announcementAuthor";
import { useCursorAnnouncementTabs } from "../../lib/announcement/useCursorAnnouncementTabs";
import { MAIN } from "../../color";
import styles from "./styles";

export const APPLICATION_STATUS_TABS = [
  "검토중",
  "수락됨",
  "활동종료",
  "거절됨",
] as const;
export type ApplicationStatusTab = (typeof APPLICATION_STATUS_TABS)[number];

export type ApplicationStatusListParams = {
  initialTab: ApplicationStatusTab;
  /** "내 활동" 요약 화면에서 넘겨준 초기 개수 (탭 라벨 표시용, 실제 목록은 커서 기반으로 다시 조회) */
  counts?: Partial<Record<ApplicationStatusTab, number>>;
};

type RootStackParamList = {
  ApplicationStatusList: ApplicationStatusListParams;
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
type ApplicationStatusListRouteProp = RouteProp<
  RootStackParamList,
  "ApplicationStatusList"
>;

function paramsForTab(tab: ApplicationStatusTab): AnnouncementListParams {
  switch (tab) {
    case "검토중":
      return { applicationStatus: "UNDER_REVIEW" };
    case "수락됨":
      return { applicationStatus: "ACCEPTED", completed: false };
    case "활동종료":
      return { applicationStatus: "ACCEPTED", completed: true };
    case "거절됨":
      return { applicationStatus: "REJECTED" };
  }
}

const ApplicationStatusListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ApplicationStatusListRouteProp>();
  const counts = route.params?.counts;
  const [activeTab, setActiveTab] = useState<ApplicationStatusTab>(
    route.params?.initialTab ?? "검토중",
  );
  const { items, loading, loadingMore, hasMore, refreshing, loadMore, onRefresh } =
    useCursorAnnouncementTabs(
      APPLICATION_STATUS_TABS,
      activeTab,
      paramsForTab,
      getMyAppliedAnnouncementList,
    );

  const tabOptions = APPLICATION_STATUS_TABS.map((tab) => ({
    tab,
    label: counts?.[tab] != null ? `${tab} (${counts[tab]})` : tab,
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
            const daysLeft = parseAnnouncementDaysLeft(item.dDay);
            return (
              <View style={styles.cardWrapper}>
                <AnnouncementCard
                  title={item.title}
                  type={item.type}
                  status={status}
                  daysLeft={daysLeft}
                  deadlineAt={item.deadlineAt}
                  completed={item.completed}
                  viewCount={item.viewCount}
                  priceType={item.priceType}
                  price={item.price}
                  address={item.address}
                  authorName={resolveAnnouncementAuthorLabel(item.user)}
                  profileImgUrl={item.user?.profileImgUrl}
                  onPress={() =>
                    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                      postId: item.postId,
                      title: item.title,
                      type: item.type,
                      status,
                      daysLeft,
                      postedDate: item.createdAt,
                      viewCount: item.viewCount,
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
          ListEmptyComponent={
            <EmptyState message="해당 상태의 지원 내역이 없습니다." />
          }
        />
      )}
    </View>
  );
};

export default ApplicationStatusListScreen;
