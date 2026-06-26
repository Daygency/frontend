import { Pressable, Text, View } from "react-native";
import CommentAuthorAvatar from "../../comments/CommentAuthorAvatar/CommentAuthorAvatar";
import type { AnnouncementPriceType } from "../../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
} from "../../../lib/announcement/announcementDeadline";
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
  /** 장소 (목록에서 태그 오른쪽에 표시) */
  address?: string;
  /** 작성자 활동명 */
  authorName?: string;
  /** 작성자 프로필 이미지 */
  profileImgUrl?: string | null;
  showNew?: boolean;
  onPress?: () => void;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
  deadlineAt,
  viewCount,
  address,
  authorName = "작성자",
  profileImgUrl,
  onPress,
}: AnnouncementCardProps) => {
  const effectiveDaysLeft = effectiveAnnouncementDaysLeft(
    deadlineAt,
    daysLeft,
  );
  const displayStatus =
    effectiveDaysLeft < 0 ? "모집마감" : status;
  const isDeadlinePassed = isAnnouncementDeadlinePassed(
    effectiveDaysLeft,
    displayStatus,
  );
  const dDayLabel = formatAnnouncementDDayLabel(
    effectiveDaysLeft,
    displayStatus,
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
            <View style={sharedAnnouncementStyles.typeTag}>
              <Text style={sharedAnnouncementStyles.typeTagText}>{type}</Text>
            </View>
            {address?.trim() ? (
              <Text style={styles.locationTagText} numberOfLines={1}>
                {formatAnnouncementDistrictLabel(address)}
              </Text>
            ) : null}
          </View>
          {typeof viewCount === "number" ? (
            <Text style={styles.viewCountText}>조회 {viewCount}</Text>
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
