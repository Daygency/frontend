import { Text, View } from "react-native";
import ShadowCardButton from "../../cards/ShadowCardButton";
import shadowCardStyles from "../../cards/ShadowCardButton/styles";
import NewBadge from "../../ui/NewBadge";
import CommentAuthorAvatar from "../../comments/CommentAuthorAvatar/CommentAuthorAvatar";
import type { AnnouncementPriceType } from "../../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
} from "../../../lib/announcement/announcementDeadline";
import { formatAnnouncementPriceLineList } from "../../../lib/announcement/announcementPrice";
import { sharedAnnouncementStyles } from "../../shared/AnnouncementShared/sharedAnnouncementStyles";
import styles from "./styles";

const LOCATION_LABEL_MAX_LENGTH = 15;

function formatLocationLabel(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length <= LOCATION_LABEL_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, LOCATION_LABEL_MAX_LENGTH)}…`;
}

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
  /** 모집 전공 이름 (표시할 항목이 있을 때만 하단 영역 렌더) */
  recruitmentMajorNames?: string[];
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
  priceType,
  price,
  recruitmentMajorNames = [],
  viewCount,
  address,
  authorName = "작성자",
  profileImgUrl,
  showNew = false,
  onPress,
}: AnnouncementCardProps) => {
  const showPrice =
    priceType !== undefined ||
    (typeof price === "number" && Number.isFinite(price));
  const showMajors = recruitmentMajorNames.length > 0;

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

  const inner = (
    <View style={styles.container}>
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
        {showNew ? <NewBadge /> : null}
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View style={styles.tagsRow}>
        <View style={sharedAnnouncementStyles.typeTag}>
          <Text style={sharedAnnouncementStyles.typeTagText}>{type}</Text>
        </View>
        <View style={sharedAnnouncementStyles.statusTag}>
          <Text style={sharedAnnouncementStyles.statusTagText}>
            {displayStatus}
          </Text>
        </View>
        {address?.trim() ? (
          // <View style={styles.locationTag}>
            <Text style={styles.locationTagText} numberOfLines={1}>
              {formatLocationLabel(address)}
            </Text>
          // </View>
        ) : null}
      </View>

      {showPrice || typeof viewCount === "number" ? (
        <View style={sharedAnnouncementStyles.priceAndViewRow}>
          {showPrice ? (
            <Text
              style={[
                sharedAnnouncementStyles.priceLine,
                sharedAnnouncementStyles.priceLineFlex,
              ]}
              numberOfLines={2}
            >
              {formatAnnouncementPriceLineList(
                priceType ?? "PENDING",
                typeof price === "number" ? price : 0,
              )}
            </Text>
          ) : (
            <View style={sharedAnnouncementStyles.priceLineFlex} />
          )}
          {typeof viewCount === "number" ? (
            <Text style={sharedAnnouncementStyles.viewCountText}>
              조회 {viewCount}
            </Text>
          ) : null}
        </View>
      ) : null}

      {showMajors ? (
        <View style={styles.recruitmentMajorsSection}>
          <Text style={styles.recruitmentMajorsLabel}>모집전공</Text>
          <View style={styles.recruitmentMajorsChips}>
            {recruitmentMajorNames.map((name, i) => (
              <View key={`${name}-${i}`} style={styles.recruitmentMajorChip}>
                <Text style={styles.recruitmentMajorChipText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return <ShadowCardButton onPress={onPress}>{inner}</ShadowCardButton>;
  }

  return (
    <View style={[shadowCardStyles.container, shadowCardStyles.shadow]}>
      {inner}
    </View>
  );
};

export default AnnouncementCard;
