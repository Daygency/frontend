import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import { applicationStatusLabel } from "../../lib/application/applicationStatusLabels";
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

function Field({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  const t = (value ?? "").trim();
  if (!t) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{t}</Text>
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
  const { applicationId } = route.params;
  const [data, setData] = useState<ApplicationEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** 어떤 심사 버튼이 요청 중인지 (로딩 표시용) */
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

  const onSetStatus = useCallback(
    (next: "ACCEPTED" | "REJECTED") => {
      if (pendingKind) return;
      const verb = next === "ACCEPTED" ? "합격" : "탈락";
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F2A44" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>{error ?? "지원서를 불러올 수 없습니다."}</Text>
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

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
      <Text style={styles.sectionTitle}>기본 정보</Text>
      <Field label="이름" value={data.name} />
      <Field label="출생연도" value={birthDisplay(data.birth)} />
      {g ? <Field label="성별" value={g} /> : null}
      <Field label="전공" value={data.major} />
      <Field label="전공 상세" value={data.majorDetail} />
      <Field label="분야" value={data.category} />
      <Field label="곡·레퍼토리" value={data.music} />
      <Field label="주소" value={data.address} />
      <Field label="학과·부서" value={data.department} />
      <Field label="링크" value={data.link} />

      {edu ? (
        <>
          <Text style={styles.sectionTitle}>학력</Text>
          <Text style={styles.value}>{edu}</Text>
        </>
      ) : null}

      {career ? (
        <>
          <Text style={styles.sectionTitle}>경력</Text>
          <Text style={styles.value}>{career}</Text>
        </>
      ) : null}

      {awards ? (
        <>
          <Text style={styles.sectionTitle}>수상</Text>
          <Text style={styles.value}>{awards}</Text>
        </>
      ) : null}

      {certs ? (
        <>
          <Text style={styles.sectionTitle}>자격증</Text>
          <Text style={styles.value}>{certs}</Text>
        </>
      ) : null}

      {data.introduce?.trim() ? (
        <>
          <Text style={styles.sectionTitle}>자기소개</Text>
          <Text style={styles.value}>{data.introduce}</Text>
        </>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>심사 상태</Text>
        <Text style={styles.value}>{applicationStatusLabel(data.status)}</Text>
      </View>
      </ScrollView>
      <View style={styles.actionBar}>
        <Pressable
          style={[
            styles.rejectBtn,
            (busy || rejectLocked) && styles.actionBtnDisabled,
          ]}
          disabled={busy || rejectLocked}
          onPress={() => onSetStatus("REJECTED")}
        >
          {pendingKind === "REJECT" ? (
            <ActivityIndicator color="#DC2626" size="small" />
          ) : (
            <Text style={styles.rejectBtnText}>탈락</Text>
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
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.acceptBtnText}>합격</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
