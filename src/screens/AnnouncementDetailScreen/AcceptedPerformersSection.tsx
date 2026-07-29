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
import type { ChatPeerSummary } from "../../lib/apis/chat/types";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { RootRoutes } from "../../navigations/routes";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

type Props = {
  postId: string;
  announcementTitle: string;
  typeTag: string;
  statusTag: string;
  dDay: string;
  /** 공연 완료 후 후기 작성 가능 */
  displayCompleted?: boolean;
  /** 합격자 카드에 후기 작성 진입 표시 (본인이 아직 후기 없을 때) */
  showReviewEntry?: boolean;
  onWriteReview?: (p: {
    userId: string;
    activityName: string;
    handle?: string;
  }) => void;
};

function displayName(application: ApplicationEntity): string {
  const fromApplicant =
    application.applicant?.name ?? application.applicant?.activityName ?? "";
  const fromApp = application.name?.trim() ?? "";
  return fromApplicant || fromApp || "지원자";
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

export default function AcceptedPerformersSection({
  postId,
  announcementTitle,
  typeTag,
  statusTag,
  dDay,
  displayCompleted = false,
  showReviewEntry = false,
  onWriteReview,
}: Props) {
  const navigation = useNavigation<any>();
  const [rows, setRows] = useState<ApplicationEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!postId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const appsRes = await getApplicationsForPost(postId);
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

    applications.sort((a, b) => {
      const ta = Date.parse(a.createdAt ?? "") || 0;
      const tb = Date.parse(b.createdAt ?? "") || 0;
      return tb - ta;
    });

    setRows(applications);
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
        <Text style={styles.sectionTitle}>수락 연주자</Text>
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
          아직 수락 처리된 연주자가 없습니다.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {rows.map((application) => {
            const id = application.id;
            const uid = (
              application.userId ??
              application.applicant?.userId ??
              ""
            ).trim();
            return (
              <View key={id} style={styles.card}>
                <Pressable
                  style={styles.cardPress}
                  onPress={() => openApplication(id)}
                >
                  <ApplicantAvatar
                    peerUserId={application.userId ?? application.applicant?.userId}
                    peer={toPeerSummary(application)}
                    size={AVATAR}
                  />
                  <Text style={styles.name} numberOfLines={2}>
                    {displayName(application)}
                  </Text>
                </Pressable>
                {displayCompleted && showReviewEntry && onWriteReview && uid ? (
                  <Pressable
                    style={styles.reviewLink}
                    onPress={() =>
                      onWriteReview({
                        userId: uid,
                        activityName:
                          application.applicant?.activityName?.trim() ||
                          application.applicant?.name?.trim() ||
                          displayName(application),
                        handle: application.applicant?.name?.trim(),
                      })
                    }
                  >
                    <Text style={styles.reviewLinkText}>후기 작성</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const AVATAR = 56;

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    borderRadius: 16,
    backgroundColor: WHITE,
    padding: 16,
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
    backgroundColor: MAIN.DEFAULT,
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
    width: 88,
    alignItems: "center",
  },
  cardPress: {
    alignItems: "center",
    width: "100%",
  },
  reviewLink: {
    marginTop: 6,
    paddingVertical: 4,
  },
  reviewLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    textDecorationLine: "underline",
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
