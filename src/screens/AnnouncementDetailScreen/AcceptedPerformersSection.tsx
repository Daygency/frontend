import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getApplicationsForPost } from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import { getRoomsByPost } from "../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../lib/apis/chat/types";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { RootRoutes } from "../../navigations/routes";
import { BLACK, BLUE, GRAY, MAIN, WHITE } from "../../color";

type Props = {
  postId: string;
  announcementTitle: string;
  typeTag: string;
  statusTag: string;
  dDay: string;
};

type RowModel = {
  application: ApplicationEntity;
  room: ChatRoomListItem | null;
};

function displayName(row: RowModel): string {
  const peer = row.room?.peer;
  const fromPeer = peer?.nickname ?? peer?.activityName ?? "";
  const fromApp = row.application.name?.trim() ?? "";
  return fromPeer || fromApp || "지원자";
}

export default function AcceptedPerformersSection({
  postId,
  announcementTitle,
  typeTag,
  statusTag,
  dDay,
}: Props) {
  const navigation = useNavigation<any>();
  const [rows, setRows] = useState<RowModel[]>([]);
  const [loading, setLoading] = useState(true);

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
      return;
    }

    const applications = appsRes.data.filter((a) => {
      if (a.deletedAt) return false;
      if (a.status !== "ACCEPTED") return false;
      return Boolean(a.id);
    });

    const merged: RowModel[] = applications.map((application) => {
      const uid = application.userId;
      const room =
        uid != null && uid !== ""
          ? (rooms.find((r) => r.peer?.userId === uid) ?? null)
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

  const openApplicants = () => {
    navigation.navigate(RootRoutes.ANNOUNCEMENT_APPLICANTS, {
      postId,
      title: announcementTitle,
      typeTag,
      statusTag,
      dDay,
    });
  };

  const openApplication = (applicationId: string) => {
    navigation.navigate(RootRoutes.RECEIVED_APPLICATION_DETAIL, {
      applicationId,
      announcementTitle,
    });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>합격 연주자</Text>
        <Pressable
          onPress={openApplicants}
          style={({ pressed }) => [
            styles.applicantsBtn,
            pressed && styles.applicantsBtnPressed,
          ]}
          android_ripple={{ color: "rgba(255,255,255,0.25)" }}
        >
          <Text style={styles.applicantsBtnText}>지원 현황 보기</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={MAIN.DEFAULT} />
        </View>
      ) : rows.length === 0 ? (
        <Text style={styles.emptyText}>
          아직 합격 처리된 연주자가 없습니다.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {rows.map((row) => {
            const peer = row.room?.peer;
            const id = row.application.id;
            return (
              <Pressable
                key={id}
                style={styles.card}
                onPress={() => openApplication(id)}
              >
                <ApplicantAvatar
                  peerUserId={row.application.userId ?? peer?.userId}
                  peer={peer ?? null}
                  size={AVATAR}
                />
                <Text style={styles.name} numberOfLines={2}>
                  {displayName(row)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const AVATAR = 56;

const styles = StyleSheet.create({
  /** 상세 화면 스크롤 시트가 패딩을 담당 */
  wrap: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: BLACK,
  },
  applicantsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: BLUE.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  applicantsBtnPressed: {
    opacity: 0.88,
  },
  applicantsBtnText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: WHITE,
    letterSpacing: 0.2,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: GRAY.DARK_100,
  },
  carouselContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingRight: 4,
  },
  card: {
    width: 80,
    alignItems: "center",
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: BLACK,
    textAlign: "center",
    width: "100%",
  },
});
