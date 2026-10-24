import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RootRoutes } from "../../navigations/routes";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import {
  getApplicationsForPost,
} from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity, ApplicationReviewStatus } from "../../lib/apis/application/types";
import { createAnnouncementRoom } from "../../lib/apis/chat/chatApi";
import type { ChatPeerSummary } from "../../lib/apis/chat/types";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { chatRoomItemToParams } from "../../lib/chat/chatRoomNavigation";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles";
import { MAIN } from "../../color";

type Params = {
  postId: string;
  title: string;
  typeTag?: string;
  statusTag?: string;
  dDay?: string;
};

type RouteParams = RouteProp<
  { AnnouncementApplicants: Params },
  "AnnouncementApplicants"
>;

const PAGE_LIMIT = 20;

function displayName(application: ApplicationEntity): string {
  const fromApplicant = application.applicant?.name ?? application.applicant?.activityName ?? "";
  const fromApp = application.name?.trim() ?? "";
  return fromApplicant || fromApp || "지원자";
}

function displayHandle(application: ApplicationEntity): string {
  const activityName = application.applicant?.activityName?.trim();
  return activityName ? `@${activityName}` : "-";
}

function toPeerSummary(application: ApplicationEntity): ChatPeerSummary | null {
  const uid = (application.userId ?? application.applicant?.userId ?? "").trim();
  if (!uid && !application.applicant) return null;
  return {
    userId: uid,
    name: application.applicant?.name ?? undefined,
    activityName: application.applicant?.activityName,
    profileImgUrl: application.applicant?.profileImgUrl,
  };
}

function sortByCreatedAtDesc(items: ApplicationEntity[]): ApplicationEntity[] {
  return [...items].sort((a, b) => {
    const ta = Date.parse(a.createdAt ?? "") || 0;
    const tb = Date.parse(b.createdAt ?? "") || 0;
    return tb - ta;
  });
}

function StatusCell({ status }: { status: ApplicationReviewStatus | undefined }) {
  if (status === "ACCEPTED") {
    return (
      <View style={[styles.statusPill, styles.statusPillAccepted]}>
        <Text style={[styles.statusPillText, styles.statusPillTextAccepted]}>수락</Text>
      </View>
    );
  }
  if (status === "REJECTED") {
    return (
      <View style={[styles.statusPill, styles.statusPillRejected]}>
        <Text style={[styles.statusPillText, styles.statusPillTextRejected]}>거절</Text>
      </View>
    );
  }
  return <Text style={styles.statusDashText}>-</Text>;
}

export default function AnnouncementApplicantsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const { postId, title } = route.params;
  const { user } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";

  const [rows, setRows] = useState<ApplicationEntity[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openingChat, setOpeningChat] = useState(false);

  const load = useCallback(async () => {
    if (!postId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const appsRes = await getApplicationsForPost(postId, { limit: PAGE_LIMIT });
    if (!appsRes?.ok) {
      setRows([]);
      setNextCursor(null);
      setHasMore(false);
      setLoading(false);
      if (appsRes && !appsRes.ok && appsRes.status === 403) {
        Alert.alert("알림", "이 공고의 지원 목록을 볼 권한이 없습니다.");
      }
      return;
    }

    setRows(sortByCreatedAtDesc(appsRes.data));
    setNextCursor(appsRes.nextCursor);
    setHasMore(appsRes.hasMore);
    setLoading(false);
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onEndReached = useCallback(async () => {
    if (!postId || !hasMore || !nextCursor || loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const appsRes = await getApplicationsForPost(postId, {
        cursor: nextCursor,
        limit: PAGE_LIMIT,
      });
      if (!appsRes?.ok) return;
      setRows((prev) => sortByCreatedAtDesc([...prev, ...appsRes.data]));
      setNextCursor(appsRes.nextCursor);
      setHasMore(appsRes.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [postId, hasMore, nextCursor, loadingMore, loading]);

  const openApplicationDetail = (applicationId: string) => {
    navigation.navigate(RootRoutes.RECEIVED_APPLICATION_DETAIL, {
      applicationId,
      announcementTitle: title,
    });
  };

  /** 수락된 지원자와의 채팅 — 공고당 그룹채팅방 1개를 열고(없으면 생성) 이동 */
  const openGroupChat = async () => {
    if (openingChat) return;
    setOpeningChat(true);
    try {
      const room = await createAnnouncementRoom(
        { postId },
        myUserId ? { myUserId } : undefined,
      );
      if (room?.id) {
        navigation.navigate(RootRoutes.CHAT_ROOM, chatRoomItemToParams(room));
      } else {
        Alert.alert("채팅", "채팅방을 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setOpeningChat(false);
    }
  };

  if (loading && rows.length === 0) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(app) => app.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => void onEndReached()}
        onEndReachedThreshold={0.35}
        ListEmptyComponent={<EmptyState message="아직 지원자가 없습니다." />}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color={MAIN.DEFAULT} />
            </View>
          ) : null
        }
        renderItem={({ item: app }) => {
          const isAccepted = app.status === "ACCEPTED";
          return (
            <View style={styles.tableRow}>
              <ApplicantAvatar
                peerUserId={app.userId ?? app.applicant?.userId}
                peer={toPeerSummary(app)}
                size={36}
              />
              <View style={styles.nameCell}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {displayName(app)}
                </Text>
                <Text style={styles.handleText} numberOfLines={1}>
                  {displayHandle(app)}
                </Text>
              </View>
              <View style={styles.statusCell}>
                <StatusCell status={app.status} />
              </View>
              <Pressable
                style={styles.outlineBtn}
                onPress={() => openApplicationDetail(app.id)}
              >
                <Text style={styles.outlineBtnText}>지원서보기</Text>
              </Pressable>
              {isAccepted ? (
                <Pressable
                  style={[styles.primaryBtn, openingChat && { opacity: 0.7 }]}
                  disabled={openingChat}
                  onPress={() => void openGroupChat()}
                >
                  {openingChat ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>채팅하기</Text>
                  )}
                </Pressable>
              ) : null}
            </View>
          );
        }}
        contentContainerStyle={contentContainerWhenEmpty(
          rows.length === 0,
          styles.listContent,
        )}
      />
    </View>
  );
}
