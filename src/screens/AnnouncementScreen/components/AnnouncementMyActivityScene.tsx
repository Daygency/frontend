import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatValueSkeleton } from "./AnnouncementMyActivitySkeleton";
import EmptyState from "../../../components/ui/EmptyState";
import { useAuth } from "../../../contexts/AuthContext";
import { MAIN } from "../../../color";
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
import { getMyAnnouncementList } from "../../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../../lib/apis/announcement/types";
import { announcementListRecruitmentStatus } from "../../../lib/announcement/announcementListStatus";
import {
  getAnnouncementApplicantSummary,
  type AnnouncementApplicantSummary,
} from "../../../lib/application/announcementApplicantSummary";
import { useAnnouncementScroll } from "../AnnouncementScrollContext";
import styles from "./announcementMyActivitySceneStyles";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type RootStackParamList = {
  ApplicationStatusList: ApplicationStatusListParams;
  MyAnnouncementStatusList: MyAnnouncementStatusListParams;
};

function myPostStatusTab(item: AnnouncementListItem): MyAnnouncementStatusTab {
  if (item.completed) return "공연완료";
  return announcementListRecruitmentStatus(item) === "모집중" ? "모집중" : "모집완료";
}

const AnnouncementMyActivityScene = () => {
  const { isLoggedIn } = useAuth();
  const { listTopInset, scrollHandler, setActiveScrollRef } = useAnnouncementScroll();
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [result, setResult] = useState<MyApplicationStatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [myAnnouncements, setMyAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [myAnnouncementsLoading, setMyAnnouncementsLoading] = useState(true);
  const [applicantSummaries, setApplicantSummaries] = useState<
    Record<string, AnnouncementApplicantSummary | null>
  >({});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (options?: { refresh?: boolean }) => {
      if (!isLoggedIn) {
        setResult(null);
        setMyAnnouncements([]);
        setApplicantSummaries({});
        setLoading(false);
        setMyAnnouncementsLoading(false);
        return;
      }
      if (!options?.refresh) {
        setLoading(true);
        setMyAnnouncementsLoading(true);
      }
      try {
        const [statusRes, myListRes] = await Promise.all([
          getMyApplicationsByStatus(),
          getMyAnnouncementList({ limit: 20 }),
        ]);
        setResult(statusRes);
        const items = myListRes?.items ?? [];
        setMyAnnouncements(items);

        const summaries = await Promise.all(
          items.map((item) => getAnnouncementApplicantSummary(item.postId)),
        );
        const summaryMap: Record<string, AnnouncementApplicantSummary | null> = {};
        items.forEach((item, index) => {
          summaryMap[item.postId] = summaries[index];
        });
        setApplicantSummaries(summaryMap);
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
      지원완료: result?.groups.SUBMITTED ?? [],
      수락: result?.groups.ACCEPTED ?? [],
      거절: result?.groups.REJECTED ?? [],
    }),
    [result],
  );

  const myPostGroups = useMemo<Record<MyAnnouncementStatusTab, AnnouncementListItem[]>>(() => {
    const groups: Record<MyAnnouncementStatusTab, AnnouncementListItem[]> = {
      모집중: [],
      모집완료: [],
      공연완료: [],
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

  if (!isLoggedIn) {
    return (
      <View style={[styles.centerFill, { paddingTop: listTopInset }]}>
        <EmptyState message="로그인이 필요합니다" />
      </View>
    );
  }

  return (
    <AnimatedScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
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
                disabled={loading && !result}
                onPress={() =>
                  navigation.navigate(RootRoutes.APPLICATION_STATUS_LIST, {
                    initialTab: tab,
                    groups: applicationStatusGroups,
                  })
                }
              >
                <Text style={styles.statLabel}>{tab}</Text>
                {loading && !result ? (
                  <StatValueSkeleton />
                ) : (
                  <Text style={styles.statValue}>{groupItems.length}</Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.myPostSection}>
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
                  disabled={myAnnouncementsLoading && myAnnouncements.length === 0}
                  onPress={() =>
                    navigation.navigate(RootRoutes.MY_ANNOUNCEMENT_STATUS_LIST, {
                      initialTab: tab,
                      groups: myPostGroups,
                      applicantSummaries,
                    })
                  }
                >
                  <Text style={styles.statLabel}>{tab}</Text>
                  {myAnnouncementsLoading && myAnnouncements.length === 0 ? (
                    <StatValueSkeleton />
                  ) : (
                    <Text style={styles.statValue}>{groupItems.length}</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </AnimatedScrollView>
  );
};

export default AnnouncementMyActivityScene;
