import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import shadowCardStyles from "../ShadowCardButton/styles";
import NewBadge from "../NewBadge/NewBadge";
import type { AnnouncementPriceType } from "../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
} from "../../lib/announcement/announcementDeadline";
import { formatAnnouncementPriceLineList } from "../../lib/announcement/announcementPrice";
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
  /** 모집 전공 이름 (표시할 항목이 있을 때만 하단 영역 렌더) */
  recruitmentMajorNames?: string[];
  /** 목록·홈 등에서 내려온 누적 조회수 */
  viewCount?: number;
  /** 장소 (목록에서 태그 오른쪽에 표시) */
  address?: string;
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
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          {showNew ? <NewBadge /> : null}
          <Text
            style={[styles.title, styles.titleInHeader]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
        <Text
          style={[
            styles.dDayText,
            isDeadlinePassed && styles.dDayTextGray,
            !isDeadlinePassed &&
              effectiveDaysLeft >= 0 &&
              effectiveDaysLeft <= 7 &&
              styles.dDayTextRed,
          ]}
        >
          {dDayLabel}
        </Text>
      </View>
      <View style={styles.tagsRow}>
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>{type}</Text>
        </View>
        <View style={styles.statusTag}>
          <Text style={styles.statusTagText}>{displayStatus}</Text>
        </View>
        {address?.trim() ? (
          <Text
            style={styles.addressInline}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {address.trim()}
          </Text>
        ) : null}
      </View>
      {showPrice || typeof viewCount === "number" ? (
        <View style={styles.priceAndViewRow}>
          {showPrice ? (
            <Text
              style={[styles.priceLine, styles.priceLineFlex]}
              numberOfLines={2}
            >
              {formatAnnouncementPriceLineList(
                priceType ?? "PENDING",
                typeof price === "number" ? price : 0,
              )}
            </Text>
          ) : (
            <View style={styles.priceLineFlex} />
          )}
          {typeof viewCount === "number" ? (
            <Text style={styles.viewCountText}>조회 {viewCount}</Text>
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
