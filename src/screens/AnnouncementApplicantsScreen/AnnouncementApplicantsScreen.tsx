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
  getApplicationById,
  getApplicationsForPost,
} from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity, ApplicationReviewStatus } from "../../lib/apis/application/types";
import {
  createAnnouncementRoom,
  getRoomsByPost,
} from "../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../lib/apis/chat/types";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { chatRoomItemToParamsWithApplicantFallback } from "../../lib/chat/chatRoomNavigation";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles";

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

type RowModel = {
  application: ApplicationEntity;
  room: ChatRoomListItem | null;
};

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

function mergeRows(
  applications: ApplicationEntity[],
  rooms: ChatRoomListItem[],
): RowModel[] {
  return applications.map((application) => {
    const uid = application.userId;
    const room =
      uid != null && uid !== ""
        ? (rooms.find((r) => r.peer?.userId === uid) ?? null)
        : null;
    return { application, room };
  });
}

function sortRowsByCreatedAtDesc(rows: RowModel[]): RowModel[] {
  return [...rows].sort((a, b) => {
    const ta = Date.parse(a.application.createdAt ?? "") || 0;
    const tb = Date.parse(b.application.createdAt ?? "") || 0;
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

  const [rows, setRows] = useState<RowModel[]>([]);
  const [rooms, setRooms] = useState<ChatRoomListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openingChatId, setOpeningChatId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!postId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [appsRes, roomsPage] = await Promise.all([
      getApplicationsForPost(postId, { limit: PAGE_LIMIT }),
      getRoomsByPost(postId, { limit: 50 }),
    ]);

    const loadedRooms = roomsPage?.items ?? [];
    setRooms(loadedRooms);
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

    setRows(sortRowsByCreatedAtDesc(mergeRows(appsRes.data, loadedRooms)));
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
      setRows((prev) =>
        sortRowsByCreatedAtDesc([...prev, ...mergeRows(appsRes.data, rooms)]),
      );
      setNextCursor(appsRes.nextCursor);
      setHasMore(appsRes.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [postId, hasMore, nextCursor, loadingMore, loading, rooms]);

  const openApplicationDetail = (applicationId: string) => {
    navigation.navigate(RootRoutes.RECEIVED_APPLICATION_DETAIL, {
      applicationId,
      announcementTitle: title,
    });
  };

  const resolveApplicantUserId = async (
    app: ApplicationEntity,
  ): Promise<string | undefined> => {
    const direct = app.userId?.trim();
    if (direct) return direct;
    const res = await getApplicationById(app.id);
    if (res.ok && res.data.userId?.trim()) return res.data.userId.trim();
    return undefined;
  };

  const openChat = async (row: RowModel) => {
    const app = row.application;
    const uid = await resolveApplicantUserId(app);
    if (!uid) {
      Alert.alert(
        "알림",
        "지원자 사용자 ID를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }

    const appWithUser = { ...app, userId: uid };

    if (row.room) {
      const params = chatRoomItemToParamsWithApplicantFallback(row.room, appWithUser);
      navigation.navigate(RootRoutes.CHAT_ROOM, params);
      return;
    }

    setOpeningChatId(app.id);
    try {
      const created = await createAnnouncementRoom(
        { postId, applicantUserId: uid },
        myUserId ? { myUserId } : undefined,
      );
      if (created) {
        const params = chatRoomItemToParamsWithApplicantFallback(created, appWithUser);
        navigation.navigate(RootRoutes.CHAT_ROOM, params);
        void load();
      } else {
        Alert.alert("채팅", "채팅방을 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setOpeningChatId(null);
    }
  };

  if (loading && rows.length === 0) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(row) => row.application.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => void onEndReached()}
        onEndReachedThreshold={0.35}
        ListEmptyComponent={<EmptyState message="아직 지원자가 없습니다." />}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color="#1F2A44" />
            </View>
          ) : null
        }
        renderItem={({ item: row }) => {
          const app = row.application;
          const peer = row.room?.peer;
          const busy = openingChatId === app.id;
          return (
            <View style={styles.tableRow}>
              <ApplicantAvatar
                peerUserId={app.userId ?? peer?.userId}
                peer={peer ?? null}
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
              <Pressable
                style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
                disabled={busy}
                onPress={() => void openChat(row)}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>채팅하기</Text>
                )}
              </Pressable>
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
