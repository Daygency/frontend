import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EmptyState from "../../../components/ui/EmptyState";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import { MAIN, WHITE } from "../../../color";
import { RootRoutes } from "../../../navigations/routes";
import {
  APPLICATION_STATUS_TABS,
  type ApplicationStatusListParams,
  type ApplicationStatusTab,
} from "../../ApplicationStatusListScreen/ApplicationStatusListScreen";
import {
  MY_ANNOUNCEMENT_STATUS_TABS,
  type MyAnnouncementStatusListParams,
  type MyAnnouncementStatusTab,
} from "../../MyAnnouncementStatusListScreen/MyAnnouncementStatusListScreen";
import {
  getMyApplicationsByStatus,
  type MyApplicationStatusResult,
} from "../../../lib/application/myApplicationStatusSummary";
import {
  getMyAnnouncementList,
  getMySchedule,
  type MyScheduleItem,
} from "../../../lib/apis/announcement/announcementApi";
import {
  MY_SCHEDULE_KIND_LABEL,
  formatScheduleDay,
  scheduleRelativeDay,
} from "../../../lib/announcement/mySchedule";
import type { AnnouncementListItem } from "../../../lib/apis/announcement/types";
import { announcementListRecruitmentStatus } from "../../../lib/announcement/announcementListStatus";
import { useAnnouncementScroll } from "../AnnouncementScrollContext";
import styles from "./announcementMyActivitySceneStyles";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type RootStackParamList = {
  ApplicationStatusList: ApplicationStatusListParams;
  MyAnnouncementStatusList: MyAnnouncementStatusListParams;
  MySchedule: undefined;
};

/** 내 활동 탭에 미리 보여줄 다가오는 일정 개수 */
const SCHEDULE_PREVIEW_COUNT = 3;

function myPostStatusTab(item: AnnouncementListItem): MyAnnouncementStatusTab {
  if (item.completed) return "종료";
  return announcementListRecruitmentStatus(item) === "모집중" ? "모집중" : "모집마감";
}

const AnnouncementMyActivityScene = () => {
  const { isLoggedIn } = useAuth();
  const { requireLogin } = useRequireLogin();
  const { listTopInset, scrollHandler, setActiveScrollRef } = useAnnouncementScroll();
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [result, setResult] = useState<MyApplicationStatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [myAnnouncements, setMyAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [myAnnouncementsLoading, setMyAnnouncementsLoading] = useState(true);
  const [schedule, setSchedule] = useState<MyScheduleItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (options?: { refresh?: boolean }) => {
      if (!isLoggedIn) {
        setResult(null);
        setMyAnnouncements([]);
        setSchedule(null);
        setLoading(false);
        setMyAnnouncementsLoading(false);
        return;
      }
      if (!options?.refresh) {
        setLoading(true);
        setMyAnnouncementsLoading(true);
      }
      try {
        const [statusRes, myListRes, scheduleRes] = await Promise.all([
          getMyApplicationsByStatus(),
          getMyAnnouncementList({ limit: 20 }),
          getMySchedule(),
        ]);
        setResult(statusRes);
        setMyAnnouncements(myListRes?.items ?? []);
        setSchedule(scheduleRes);
      } finally {
        setLoading(false);
        setMyAnnouncementsLoading(false);
      }
    },
    [isLoggedIn],
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setActiveScrollRef(scrollViewRef.current);
    return () => setActiveScrollRef(null);
  }, [setActiveScrollRef]);

  const applicationStatusGroups = useMemo<Record<ApplicationStatusTab, AnnouncementListItem[]>>(
    () => ({
      검토중: result?.groups.UNDER_REVIEW ?? [],
      수락됨: result?.groups.ACCEPTED ?? [],
      활동종료: result?.groups.ACTIVITY_ENDED ?? [],
      거절됨: result?.groups.REJECTED ?? [],
    }),
    [result],
  );

  const myPostGroups = useMemo<Record<MyAnnouncementStatusTab, AnnouncementListItem[]>>(() => {
    const groups: Record<MyAnnouncementStatusTab, AnnouncementListItem[]> = {
      모집중: [],
      모집마감: [],
      종료: [],
    };
    myAnnouncements.forEach((item) => {
      groups[myPostStatusTab(item)].push(item);
    });
    return groups;
  }, [myAnnouncements]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load({ refresh: true });
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const applicationStatsReady = !loading || result != null;
  const myPostStatsReady = !myAnnouncementsLoading || myAnnouncements.length > 0;

  if (!isLoggedIn) {
    return (
      <View style={[styles.centerFill, { paddingTop: listTopInset }]}>
        <EmptyState message="로그인이 필요합니다" />
        <Pressable style={styles.loginBtn} onPress={requireLogin}>
          <Text style={styles.loginBtnText}>로그인하기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <AnimatedScrollView
      ref={scrollViewRef}
      style={{ flex: 1, backgroundColor: WHITE }}
      contentContainerStyle={[styles.scrollContent, { paddingTop: listTopInset }]}
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
      {schedule ? (
        <View style={[styles.contentSheet, styles.firstContentSheet]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>내 일정</Text>
            <Pressable
              hitSlop={10}
              onPress={() => navigation.navigate(RootRoutes.MY_SCHEDULE)}
            >
              <Text style={styles.sectionMore}>전체 보기</Text>
            </Pressable>
          </View>
          {schedule.length === 0 ? (
            <Text style={styles.scheduleEmpty}>다가오는 일정이 없어요.</Text>
          ) : (
            schedule.slice(0, SCHEDULE_PREVIEW_COUNT).map((item) => (
              <Pressable
                key={`${item.kind}:${item.postId}`}
                style={styles.scheduleRow}
                onPress={() => navigation.navigate(RootRoutes.MY_SCHEDULE)}
              >
                <Text style={styles.scheduleDay}>
                  {formatScheduleDay(item.date)}
                </Text>
                <View style={styles.scheduleBody}>
                  <Text style={styles.scheduleKind}>
                    {MY_SCHEDULE_KIND_LABEL[item.kind]} ·{" "}
                    {scheduleRelativeDay(item.date)}
                  </Text>
                  <Text style={styles.scheduleTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      ) : null}

      {applicationStatsReady ? (
        <View
          style={[styles.contentSheet, !schedule && styles.firstContentSheet]}
        >
          <Text style={styles.sectionTitle}>지원 현황</Text>
          <View style={styles.statCard}>
            {APPLICATION_STATUS_TABS.map((tab, index) => {
              const groupItems = applicationStatusGroups[tab];
              return (
                <View
                  key={tab}
                  style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                >
                  {index > 0 ? <View style={styles.statDivider} /> : null}
                  <Pressable
                    style={styles.statColumn}
                    onPress={() =>
                      navigation.navigate(RootRoutes.APPLICATION_STATUS_LIST, {
                        initialTab: tab,
                        counts: {
                          검토중: applicationStatusGroups.검토중.length,
                          수락됨: applicationStatusGroups.수락됨.length,
                          활동종료: applicationStatusGroups.활동종료.length,
                          거절됨: applicationStatusGroups.거절됨.length,
                        },
                      })
                    }
                  >
                    <Text style={styles.statLabel}>{tab}</Text>
                    <Text style={styles.statValue}>{groupItems.length}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

      {myPostStatsReady ? (
        <View style={styles.contentSheet}>
          <Text style={styles.sectionTitle}>내가 만든 공고</Text>
          <View style={styles.statCard}>
            {MY_ANNOUNCEMENT_STATUS_TABS.map((tab, index) => {
              const groupItems = myPostGroups[tab];
              return (
                <View
                  key={tab}
                  style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                >
                  {index > 0 ? <View style={styles.statDivider} /> : null}
                  <Pressable
                    style={styles.statColumn}
                    onPress={() =>
                      navigation.navigate(RootRoutes.MY_ANNOUNCEMENT_STATUS_LIST, {
                        initialTab: tab,
                        counts: {
                          모집중: myPostGroups.모집중.length,
                          모집마감: myPostGroups.모집마감.length,
                          종료: myPostGroups.종료.length,
                        },
                      })
                    }
                  >
                    <Text style={styles.statLabel}>{tab}</Text>
                    <Text style={styles.statValue}>{groupItems.length}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </AnimatedScrollView>
  );
};

export default AnnouncementMyActivityScene;
