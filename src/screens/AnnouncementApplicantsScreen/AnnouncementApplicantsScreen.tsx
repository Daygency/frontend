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
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootRoutes } from "../../navigations/routes";
import {
  getApplicationById,
  getApplicationsForPost,
} from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import {
  createAnnouncementRoom,
  getRoomsByPost,
} from "../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../lib/apis/chat/types";
import { formatChatListTime } from "../../lib/chat/formatChatTime";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { chatRoomItemToParamsWithApplicantFallback } from "../../lib/chat/chatRoomNavigation";
import { applicationStatusLabel } from "../../lib/application/applicationStatusLabels";
import type { ApplicationReviewStatus } from "../../lib/apis/application/types";
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

export default function AnnouncementApplicantsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const { postId, title, typeTag, statusTag, dDay } = route.params;
  const { user } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";

  const [rows, setRows] = useState<RowModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openingChatId, setOpeningChatId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!postId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [appsRes, roomsPage] = await Promise.all([
      getApplicationsForPost(postId),
      getRoomsByPost(postId, { limit: 100 }),
    ]);

    const rooms = roomsPage?.items ?? [];
    if (!appsRes?.ok) {
      setRows([]);
      setLoading(false);
      if (appsRes && !appsRes.ok && appsRes.status === 403) {
        Alert.alert("알림", "이 공고의 지원 목록을 볼 권한이 없습니다.");
      }
      return;
    }

    const applications = appsRes.data.filter((a) => {
      if (a.deletedAt) return false;
      return Boolean(a.id);
    });

    const merged: RowModel[] = applications.map((application) => {
      const uid = application.userId;
      const room =
        uid != null && uid !== ""
          ? rooms.find((r) => r.peer?.userId === uid) ?? null
          : null;
      return { application, room };
    });

    merged.sort((a, b) => {
      const ta = Date.parse(a.application.createdAt ?? "") || 0;
      const tb = Date.parse(b.application.createdAt ?? "") || 0;
      return tb - ta;
    });

    setRows(merged);
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

  const displayName = (row: RowModel): string => {
    const peer = row.room?.peer;
    const fromPeer = peer?.nickname ?? peer?.activityName ?? "";
    const fromApp = row.application.name?.trim() ?? "";
    return fromPeer || fromApp || "지원자";
  };

  const previewLine = (row: RowModel): string => {
    const last = row.room?.lastMessage?.content?.trim();
    if (last) return last;
    return `[${title}] 공고에 신청하였습니다.`;
  };

  const timeLabel = (row: RowModel): string => {
    const t =
      row.room?.lastMessage?.createdAt ?? row.application.createdAt ?? "";
    return t ? formatChatListTime(t) : "";
  };

  const statusTagStyles = (status: ApplicationReviewStatus | undefined) => {
    switch (status) {
      case "ACCEPTED":
        return [styles.statusTag, styles.statusTagAccepted];
      case "REJECTED":
        return [styles.statusTag, styles.statusTagRejected];
      case "DOCUMENT_REVIEW":
        return [styles.statusTag, styles.statusTagReview];
      default:
        return [styles.statusTag, styles.statusTagSubmitted];
    }
  };

  const statusTagTextStyles = (status: ApplicationReviewStatus | undefined) => {
    switch (status) {
      case "ACCEPTED":
        return [styles.statusTagText, styles.statusTagTextAccepted];
      case "REJECTED":
        return [styles.statusTagText, styles.statusTagTextRejected];
      case "DOCUMENT_REVIEW":
        return [styles.statusTagText, styles.statusTagTextReview];
      default:
        return [styles.statusTagText, styles.statusTagTextSubmitted];
    }
  };

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
      const params = chatRoomItemToParamsWithApplicantFallback(
        row.room,
        appWithUser,
      );
      navigation.navigate(RootRoutes.CHAT_ROOM, params);
      return;
    }

    setOpeningChatId(app.id);
    try {
      const created = await createAnnouncementRoom(
        {
          postId,
          applicantUserId: uid,
        },
        myUserId ? { myUserId } : undefined,
      );
      if (created) {
        const params = chatRoomItemToParamsWithApplicantFallback(
          created,
          appWithUser,
        );
        navigation.navigate(RootRoutes.CHAT_ROOM, params);
        void load();
      } else {
        Alert.alert(
          "채팅",
          "채팅방을 열지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    } finally {
      setOpeningChatId(null);
    }
  };

  const listHeader = (
    <View>
      <View style={styles.postCard}>
        <View style={styles.postThumb} />
        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.postTagsRow}>
            {typeTag ? (
              <View style={[styles.tagChip, styles.tagChipOrange]}>
                <Text style={[styles.tagText, styles.tagTextOrange]}>{typeTag}</Text>
              </View>
            ) : null}
            {statusTag ? (
              <View style={[styles.tagChip, styles.tagChipGray]}>
                <Text style={[styles.tagText, styles.tagTextGray]}>{statusTag}</Text>
              </View>
            ) : null}
            {dDay ? (
              <View style={[styles.tagChip, styles.tagChipNavy]}>
                <Text style={[styles.tagText, styles.tagTextNavy]}>{dDay}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <Text style={styles.sectionLabel}>지원자 {rows.length}</Text>
    </View>
  );

  if (loading && rows.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
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
        keyExtractor={(r) => r.application.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            <Text style={{ color: "#888", textAlign: "center" }}>
              아직 지원자가 없습니다.
            </Text>
          </View>
        }
        renderItem={({ item: row }) => {
          const peer = row.room?.peer;
          const busy = openingChatId === row.application.id;
          const st = row.application.status;
          return (
            <View style={styles.applicantCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardHeader}>
                  <ApplicantAvatar
                    peerUserId={row.application.userId ?? peer?.userId}
                    peer={peer ?? null}
                    size={44}
                  />
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.applicantName} numberOfLines={1}>
                      {displayName(row)}
                    </Text>
                    {timeLabel(row) ? (
                      <Text style={styles.timeText}>{timeLabel(row)}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={statusTagStyles(st)}>
                  <Text style={statusTagTextStyles(st)} numberOfLines={1}>
                    {applicationStatusLabel(st)}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewText} numberOfLines={2}>
                {previewLine(row)}
              </Text>
              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.outlineBtn}
                  onPress={() => openApplicationDetail(row.application.id)}
                >
                  <Text style={styles.outlineBtnText}>지원서 확인하기</Text>
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
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
