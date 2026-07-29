import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
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
  expanded: boolean;
  onToggleExpanded: () => void;
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
  expanded,
  onToggleExpanded,
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
    <Animated.View style={styles.wrap} layout={LinearTransition.duration(220)}>
      <View style={[styles.headerRow, expanded && styles.headerRowExpanded]}>
        <Pressable
          style={styles.titleToggle}
          onPress={onToggleExpanded}
          hitSlop={6}
        >
          <Text style={styles.sectionTitle}>내가 수락한 연주자</Text>
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-up"}
            size={18}
            color={GRAY.DARK}
          />
        </Pressable>
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

      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(120)}
          layout={LinearTransition.duration(220)}
        >
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={MAIN.DEFAULT} />
            </View>
          ) : rows.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                아직 수락 처리된 연주자가 없습니다.
              </Text>
            </View>
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
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const AVATAR = 56;
/** loading·empty 상태가 서로 다른 높이라 카드가 출렁이지 않도록 맞추는 최소 높이 */
const CONTENT_MIN_HEIGHT = 40;

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRowExpanded: {
    marginBottom: 12,
  },
  titleToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
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
    minHeight: CONTENT_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    minHeight: CONTENT_MIN_HEIGHT,
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
