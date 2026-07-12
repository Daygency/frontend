import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import { applicationStatusLabel } from "../../lib/application/applicationStatusLabels";
import type { AnnouncementAuthor } from "../../lib/announcement/extractAnnouncementAuthor";
import { useAnnouncementAuthorLabel } from "../../lib/announcement/useAnnouncementAuthorLabel";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import { sharedAnnouncementStyles } from "../../components/shared/AnnouncementShared/sharedAnnouncementStyles";
import { RootRoutes } from "../../navigations/routes";
import { MAIN, RED, WHITE } from "../../color";
import styles from "./styles";

type Params = {
  applicationId: string;
  announcementTitle?: string;
};

type RouteParams = RouteProp<
  { ReceivedApplicationDetail: Params },
  "ReceivedApplicationDetail"
>;

function formatGender(g: ApplicationEntity["gender"]): string {
  if (g === "FEMALE") return "여성";
  if (g === "MALE") return "남성";
  if (g === "NONE") return "선택없음";
  return "";
}

function birthDisplay(birth: string | undefined): string {
  if (!birth?.trim()) return "";
  const m = /^(\d{4})/.exec(birth.trim());
  return m ? `${m[1]}년` : birth.trim();
}

function resolveApplicantAuthor(
  data: ApplicationEntity,
): AnnouncementAuthor | null {
  const userId = (data.applicant?.userId ?? data.userId ?? "").trim();
  if (!userId) return null;
  return {
    userId,
    name: data.applicant?.name ?? data.name ?? undefined,
    activityName: data.applicant?.activityName ?? data.activityName,
    profileImgUrl: data.applicant?.profileImgUrl ?? data.profileImgUrl,
  };
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  const text = (value ?? "").trim();
  if (!text) return null;
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{text}</Text>
    </View>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {children}
    </View>
  );
}

function formatStatusErrorMessage(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t) return "요청에 실패했습니다.";
  try {
    const o = JSON.parse(t) as { message?: unknown };
    if (typeof o.message === "string" && o.message) return o.message;
    if (Array.isArray(o.message) && o.message.length) {
      return o.message.map(String).join("\n");
    }
  } catch {
    /* plain text */
  }
  return t.length > 400 ? `${t.slice(0, 400)}...` : t;
}

export default function ReceivedApplicationDetailScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const floatingBottomPad = insets.bottom + 4;
  const scrollBottomPad = 88 + floatingBottomPad;
  const { applicationId, announcementTitle } = route.params;
  const [data, setData] = useState<ApplicationEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingKind, setPendingKind] = useState<"ACCEPT" | "REJECT" | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await getApplicationById(applicationId);
      if (cancelled) return;
      if (res.ok) {
        setData(res.data);
      } else {
        setError(
          res.status === 403
            ? "이 지원서를 볼 권한이 없습니다."
            : res.status === 404
              ? "지원서를 찾을 수 없습니다."
              : "지원서를 불러오지 못했습니다.",
        );
        setData(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const applicantAuthor = useMemo(
    () => (data ? resolveApplicantAuthor(data) : null),
    [data],
  );
  const applicantDisplayLabel = useAnnouncementAuthorLabel(applicantAuthor);

  const onSetStatus = useCallback(
    (next: "ACCEPTED" | "REJECTED") => {
      if (pendingKind) return;
      const verb = next === "ACCEPTED" ? "수락" : "거절";
      Alert.alert("확인", `이 지원자를 ${verb} 처리할까요?`, [
        { text: "취소", style: "cancel" },
        {
          text: verb,
          style: next === "REJECTED" ? "destructive" : "default",
          onPress: async () => {
            setPendingKind(next === "ACCEPTED" ? "ACCEPT" : "REJECT");
            try {
              const res = await updateApplicationStatus(applicationId, {
                status: next,
              });
              if (res.ok) {
                setData(res.data);
                Alert.alert(
                  "완료",
                  `심사 상태가 ${applicationStatusLabel(next)}(으)로 변경되었습니다.`,
                );
              } else {
                Alert.alert("알림", formatStatusErrorMessage(res.message));
              }
            } finally {
              setPendingKind(null);
            }
          },
        },
      ]);
    },
    [applicationId, pendingKind],
  );

  const navigateToApplicantPortfolio = () => {
    if (!applicantAuthor?.userId) return;
    navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
      userId: applicantAuthor.userId,
      activityName: applicantAuthor.activityName?.trim() ?? "",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          {error ?? "지원서를 불러올 수 없습니다."}
        </Text>
      </View>
    );
  }

  const g = formatGender(data.gender);
  const edu = data.education?.length
    ? data.education
        .map((e) => {
          const y1 = e.startedAt?.slice(0, 4);
          const y2 = e.endedAt != null ? String(e.endedAt).slice(0, 4) : "";
          const range =
            y1 || y2 ? ` (${y1 ?? "?"}~${y2 || "현재"})` : "";
          return `${e.description}${range}`;
        })
        .join("\n")
    : "";
  const career = data.career?.length
    ? data.career.map((c) => c.description).join("\n")
    : "";
  const awards = data.award?.length
    ? data.award.map((a) => a.description).join("\n")
    : "";
  const certs = data.certificate?.length
    ? data.certificate.map((c) => c.description).join("\n")
    : "";

  const status = data.status;
  const acceptLocked = status === "ACCEPTED";
  const rejectLocked = status === "REJECTED";
  const busy = pendingKind !== null;
  const displayTitle = announcementTitle?.trim() || "지원서";
  const statusLabel = applicationStatusLabel(data.status);
  const majorLabel = data.major?.trim() || "";

  const basicFields = [
    { label: "이름", value: data.name },
    { label: "출생연도", value: birthDisplay(data.birth) },
    ...(g ? [{ label: "성별", value: g }] : []),
    { label: "전공", value: data.major },
    { label: "전공 상세", value: data.majorDetail },
    { label: "분야", value: data.category },
    { label: "곡·레퍼토리", value: data.music },
    { label: "주소", value: data.address },
    { label: "학과·부서", value: data.department },
    { label: "링크", value: data.link },
  ].filter((f) => (f.value ?? "").trim());

  return (
    <View style={styles.container}>
      <View style={styles.detailInner}>
        <ScrollView
          style={styles.detailScroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: scrollBottomPad },
          ]}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{displayTitle}</Text>
              {applicantAuthor ? (
                <Pressable
                  style={styles.applicantChip}
                  onPress={navigateToApplicantPortfolio}
                >
                  <ApplicantAvatar
                    peerUserId={applicantAuthor.userId}
                    peer={{
                      userId: applicantAuthor.userId,
                      name: applicantAuthor.name,
                      activityName: applicantAuthor.activityName,
                      profileImgUrl: applicantAuthor.profileImgUrl,
                      profileImageUrl: applicantAuthor.profileImgUrl,
                    }}
                    size={28}
                  />
                  <Text style={styles.applicantName} numberOfLines={1}>
                    {applicantDisplayLabel}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.badgeRow}>
              <View style={sharedAnnouncementStyles.statusTag}>
                <Text style={sharedAnnouncementStyles.statusTagText}>
                  {statusLabel}
                </Text>
              </View>
              {majorLabel ? (
                <Text style={styles.majorText} numberOfLines={1}>
                  {majorLabel}
                </Text>
              ) : null}
            </View>

            {basicFields.length > 0 ? (
              <DetailSection title="기본 정보">
                {basicFields.map((field) => (
                  <DetailField
                    key={field.label}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </DetailSection>
            ) : null}

            {edu ? (
              <DetailSection title="학력">
                <Text style={styles.multilineValue}>{edu}</Text>
              </DetailSection>
            ) : null}

            {career ? (
              <DetailSection title="경력">
                <Text style={styles.multilineValue}>{career}</Text>
              </DetailSection>
            ) : null}

            {awards ? (
              <DetailSection title="수상">
                <Text style={styles.multilineValue}>{awards}</Text>
              </DetailSection>
            ) : null}

            {certs ? (
              <DetailSection title="자격증">
                <Text style={styles.multilineValue}>{certs}</Text>
              </DetailSection>
            ) : null}

            {data.introduce?.trim() ? (
              <DetailSection title="자기소개">
                <Text style={styles.multilineValue}>{data.introduce}</Text>
              </DetailSection>
            ) : null}
          </View>
        </ScrollView>
      </View>

      <View
        style={[styles.floatingBottomBar, { paddingBottom: floatingBottomPad }]}
      >
        <Pressable
          style={[
            styles.rejectBtn,
            (busy || rejectLocked) && styles.actionBtnDisabled,
          ]}
          disabled={busy || rejectLocked}
          onPress={() => onSetStatus("REJECTED")}
        >
          {pendingKind === "REJECT" ? (
            <ActivityIndicator color={RED.DEFAULT} size="small" />
          ) : (
            <Text style={styles.rejectBtnText}>거절</Text>
          )}
        </Pressable>
        <Pressable
          style={[
            styles.acceptBtn,
            (busy || acceptLocked) && styles.actionBtnDisabled,
          ]}
          disabled={busy || acceptLocked}
          onPress={() => onSetStatus("ACCEPTED")}
        >
          {pendingKind === "ACCEPT" ? (
            <ActivityIndicator color={WHITE} size="small" />
          ) : (
            <Text style={styles.acceptBtnText}>수락</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
