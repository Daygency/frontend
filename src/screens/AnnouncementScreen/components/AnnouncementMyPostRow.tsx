import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sharedAnnouncementStyles } from "../../../components/shared/AnnouncementShared/sharedAnnouncementStyles";
import { GRAY } from "../../../color";
import type { AnnouncementApplicantSummary } from "../../../lib/application/announcementApplicantSummary";
import styles from "./announcementMyPostRowStyles";

type AnnouncementMyPostRowProps = {
  title: string;
  status: "모집중" | "모집마감";
  type: string;
  createdAt?: string;
  completed?: boolean;
  summary: AnnouncementApplicantSummary | null;
  /** 카드 본문을 눌렀을 때 — 해당 공고 상세로 이동 */
  onPress: () => void;
  /** 우측 상단 버튼을 눌렀을 때 — 지원자 현황으로 이동 */
  onPressApplicants: () => void;
};

function parseCreatedAtTime(createdAt?: string): number {
  const raw = createdAt?.trim();
  if (!raw) return NaN;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && raw.length >= 10) {
    return raw.length <= 10 ? numeric * 1000 : numeric;
  }
  return new Date(raw).getTime();
}

function formatCreatedDate(createdAt?: string): string {
  const time = parseCreatedAtTime(createdAt);
  if (Number.isNaN(time)) return "";
  const d = new Date(time);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}`;
}

const AnnouncementMyPostRow = ({
  title,
  status,
  type,
  createdAt,
  completed,
  summary,
  onPress,
  onPressApplicants,
}: AnnouncementMyPostRowProps) => {
  const isOpen = status === "모집중";
  const dateLabel = formatCreatedDate(createdAt);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.statusChip}>
          <View style={[styles.statusDot, isOpen ? styles.statusDotOpen : styles.statusDotClosed]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.applicantButton,
            pressed && styles.applicantButtonPressed,
          ]}
          onPress={onPressApplicants}
        >
          <Text style={styles.applicantButtonText}>지원자 현황</Text>
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>

      <View style={styles.tagsRow}>
        <View style={sharedAnnouncementStyles.typeTag}>
          <Text style={sharedAnnouncementStyles.typeTagText}>{type}</Text>
        </View>
        {completed ? (
          <View style={styles.completedTag}>
            <Text style={styles.completedTagText}>완료</Text>
          </View>
        ) : null}
      </View>

      {dateLabel ? (
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={GRAY.DARK} />
          <Text style={styles.dateText}>{dateLabel}</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>
          전체 <Text style={styles.statsValue}>{summary?.total ?? 0}</Text>
        </Text>
        <View style={styles.statsSeparator} />
        <Text style={styles.statsLabel}>
          지원완료 <Text style={styles.statsValue}>{summary?.submitted ?? 0}</Text>
        </Text>
        <Text style={styles.statsLabel}>
          거절 <Text style={styles.statsValue}>{summary?.rejected ?? 0}</Text>
        </Text>
        <Text style={styles.statsLabel}>
          수락 <Text style={styles.statsValue}>{summary?.accepted ?? 0}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

export default AnnouncementMyPostRow;
