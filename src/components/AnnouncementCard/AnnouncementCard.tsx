import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import type { AnnouncementPriceType } from "../../lib/apis/announcement/types";
import { formatAnnouncementPriceLineList } from "../../lib/announcement/announcementPrice";
import styles from "./styles";

interface AnnouncementCardProps {
  title: string;
  type?: string;
  status?: string;
  daysLeft?: number;
  /** API가 내려줄 때만 표시 */
  priceType?: AnnouncementPriceType;
  price?: number;
  /** 모집 전공 이름 (표시할 항목이 있을 때만 하단 영역 렌더) */
  recruitmentMajorNames?: string[];
  /** 목록·홈 등에서 내려온 누적 조회수 */
  viewCount?: number;
  onPress?: () => void;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
  priceType,
  price,
  recruitmentMajorNames = [],
  viewCount,
  onPress,
}: AnnouncementCardProps) => {
  const showPrice =
    priceType !== undefined ||
    (typeof price === "number" && Number.isFinite(price));
  const showMajors = recruitmentMajorNames.length > 0;

  return (
    <ShadowCardButton onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.tagsContainer} />
          <Text
            style={[
              styles.dDayText,
              (daysLeft === 0 || daysLeft === 7) && styles.dDayTextRed,
            ]}
          >
            {daysLeft === 0 ? "오늘마감" : `D-${daysLeft}`}
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{type}</Text>
          </View>
          <View style={styles.statusTag}>
            <Text style={styles.statusTagText}>{status}</Text>
          </View>
        </View>
        {showPrice || typeof viewCount === "number" ? (
          <View style={styles.priceAndViewRow}>
            {showPrice ? (
              <Text
                style={[styles.priceLine, styles.priceLineBesideView]}
                numberOfLines={2}
              >
                {formatAnnouncementPriceLineList(
                  priceType ?? "PENDING",
                  typeof price === "number" ? price : 0,
                )}
              </Text>
            ) : (
              <View style={styles.priceLineBesideView} />
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
    </ShadowCardButton>
  );
};

export default AnnouncementCard;
