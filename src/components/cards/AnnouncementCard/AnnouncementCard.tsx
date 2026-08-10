import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CommentAuthorAvatar from "../../comments/CommentAuthorAvatar/CommentAuthorAvatar";
import type { AnnouncementPriceType } from "../../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
  resolveAnnouncementRecruitmentStatus,
} from "../../../lib/announcement/announcementDeadline";
import { formatAnnouncementPriceLineList } from "../../../lib/announcement/announcementPrice";
import { formatAnnouncementDistrictLabel } from "../../../lib/announcement/announcementAddress";
import { sharedAnnouncementStyles } from "../../shared/AnnouncementShared/sharedAnnouncementStyles";
import styles from "./styles";

interface AnnouncementCardProps {
  title: string;
  type?: string;
  status?: string;
  daysLeft?: number;
  /** 있으면 로컬 날짜 기준으로 남은 일수를 계산해 `dDay`보다 우선합니다 */
  deadlineAt?: string;
  /** API가 내려줄 때만 표시 */
  priceType?: AnnouncementPriceType;
  price?: number;
  /** 목록·홈 등에서 내려온 누적 조회수 */
  viewCount?: number;
  /** 공연·일정 종료 여부 */
  completed?: boolean;
  /** 장소 (목록에서 태그 오른쪽에 표시) */
  address?: string;
  /** 작성자 활동명 */
  authorName?: string;
  /** 작성자 프로필 이미지 */
  profileImgUrl?: string | null;
  relativeTimeText?: string;
  showNew?: boolean;
  onPress?: () => void;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
  deadlineAt,
  priceType,
  price,
  viewCount,
  completed,
  address,
  authorName = "작성자",
  profileImgUrl,
  relativeTimeText,
  onPress,
}: AnnouncementCardProps) => {
  const effectiveDaysLeft = effectiveAnnouncementDaysLeft(
    deadlineAt,
    daysLeft,
  );
  const displayStatus = resolveAnnouncementRecruitmentStatus(
    status === "모집중",
    { completed, deadlineAt },
  );
  const isDeadlinePassed = isAnnouncementDeadlinePassed(
    effectiveDaysLeft,
    displayStatus,
  );
  const dDayLabel = formatAnnouncementDDayLabel(
    effectiveDaysLeft,
    displayStatus,
    completed,
    deadlineAt,
  );

  const priceLabel = formatAnnouncementPriceLineList(
    priceType ?? "PENDING",
    typeof price === "number" ? price : 0,
  );

  const content = (
    <>
      <View style={styles.topSection}>
        <View style={styles.profileRow}>
          <CommentAuthorAvatar
            profileImgUrl={profileImgUrl}
            size={28}
            style={styles.profileAvatar}
          />
          <Text style={styles.authorName} numberOfLines={1} ellipsizeMode="tail">
            {authorName}
          </Text>
          <Text
            style={[
              sharedAnnouncementStyles.dDayText,
              styles.dDayOnRow,
              isDeadlinePassed && sharedAnnouncementStyles.dDayTextGray,
              !isDeadlinePassed &&
                effectiveDaysLeft >= 0 &&
                effectiveDaysLeft <= 7 &&
                sharedAnnouncementStyles.dDayTextRed,
            ]}
          >
            {dDayLabel}
          </Text>
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.footerSection}>
        <View style={styles.tagsRow}>
          <View style={styles.tagsGroup}>
            {priceLabel ? (
              <Text style={styles.priceText} numberOfLines={1}>
                {priceLabel}
              </Text>
            ) : null}
            <View style={sharedAnnouncementStyles.typeTag}>
              <Text style={sharedAnnouncementStyles.typeTagText}>{type}</Text>
            </View>
            {address?.trim() ? (
              <Text style={styles.locationTagText} numberOfLines={1}>
                {formatAnnouncementDistrictLabel(address)}
              </Text>
            ) : null}
          </View>
          {typeof viewCount === "number" || relativeTimeText ? (
            <View style={styles.footerMetaRow}>
              {typeof viewCount === "number" ? (
                <View style={styles.viewCountRow}>
                  <Ionicons name="eye-outline" size={13} color="#A0A0A0" />
                  <Text style={styles.viewCountText}>{viewCount}</Text>
                </View>
              ) : null}
              {typeof viewCount === "number" && relativeTimeText ? (
                <Text style={styles.footerMetaSeparator}>·</Text>
              ) : null}
              {relativeTimeText ? (
                <Text style={styles.relativeTimeText} numberOfLines={1}>
                  {relativeTimeText}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={styles.card} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

export default AnnouncementCard;
