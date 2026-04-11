import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getApplicationById } from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
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

function formatReviewStatus(
  s: NonNullable<ApplicationEntity["status"]>,
): string {
  const map: Record<string, string> = {
    SUBMITTED: "제출됨",
    DOCUMENT_REVIEW: "서류 검토 중",
    ACCEPTED: "합격",
    REJECTED: "불합격",
  };
  return map[s] ?? s;
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

export default function ReceivedApplicationDetailScreen() {
  const route = useRoute<RouteParams>();
  const { applicationId } = route.params;
  const [data, setData] = useState<ApplicationEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

      {data.status ? (
        <View style={styles.row}>
          <Text style={styles.label}>심사 상태</Text>
          <Text style={styles.value}>{formatReviewStatus(data.status)}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
