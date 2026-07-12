import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementMyPostRow from "./AnnouncementMyPostRow";
import EmptyState from "../../../components/ui/EmptyState";
import { useAuth } from "../../../contexts/AuthContext";
import { MAIN } from "../../../color";
import { RootRoutes } from "../../../navigations/routes";
import type { ApplicationStatusListParams } from "../../ApplicationStatusListScreen/ApplicationStatusListScreen";
import {
  getMyApplicationsByStatus,
  type MyApplicationStatusGroups,
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
  AnnouncementApplicants: { postId: string; title: string };
};

const STAT_ITEMS: { key: keyof MyApplicationStatusGroups; label: string }[] = [
  { key: "SUBMITTED", label: "지원완료" },
  { key: "ACCEPTED", label: "수락" },
  { key: "REJECTED", label: "거절" },
];

const AnnouncementMyActivityScene = () => {
  const { isLoggedIn } = useAuth();
  const { listTopInset, scrollHandler } = useAnnouncementScroll();
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
      {loading && !result ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={MAIN.DEFAULT} />
        </View>
      ) : (
        <View style={styles.statCard}>
          {STAT_ITEMS.map((item, index) => {
            const groupItems = result?.groups[item.key] ?? [];
            return (
              <View
                key={item.key}
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              >
                {index > 0 ? <View style={styles.statDivider} /> : null}
                <Pressable
                  style={styles.statColumn}
                  onPress={() =>
                    navigation.navigate(RootRoutes.APPLICATION_STATUS_LIST, {
                      label: item.label,
                      items: groupItems,
                    })
                  }
                >
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={styles.statValue}>{groupItems.length}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.myPostSection}>
        <Text style={styles.sectionTitle}>내가 만든 공고</Text>
        {myAnnouncementsLoading && myAnnouncements.length === 0 ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : myAnnouncements.length === 0 ? (
          <View style={styles.emptyCard}>
            <EmptyState message="작성한 공고가 없습니다" />
          </View>
        ) : (
          myAnnouncements.map((item) => (
            <AnnouncementMyPostRow
              key={item.postId}
              title={item.title}
              status={announcementListRecruitmentStatus(item)}
              type={item.type}
              createdAt={item.createdAt}
              completed={item.completed}
              summary={applicantSummaries[item.postId] ?? null}
              onPress={() =>
                navigation.navigate(RootRoutes.ANNOUNCEMENT_APPLICANTS, {
                  postId: item.postId,
                  title: item.title,
                })
              }
            />
          ))
        )}
      </View>
    </AnimatedScrollView>
  );
};

export default AnnouncementMyActivityScene;
