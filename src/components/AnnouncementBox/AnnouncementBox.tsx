import { Text, View } from "react-native";
import Tag from "../Tag/Tag";
import type { AnnouncementPriceType } from "../../lib/apis/announcement/types";
import { formatAnnouncementPriceLine } from "../../lib/announcement/announcementPrice";
import styles from "./styles";
import { AnnouncementDetailParams } from "../../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";

type AnnouncementBoxProps = AnnouncementDetailParams & {
  priceType?: AnnouncementPriceType;
  price?: number;
};

const AnnouncementBox = ({
  title,
  type,
  status,
  daysLeft,
  viewCount,
  priceType,
  price,
}: AnnouncementBoxProps) => {
  const showPrice =
    priceType !== undefined ||
    (typeof price === "number" && Number.isFinite(price));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showPrice || typeof viewCount === "number" ? (
        <View style={styles.priceAndViewRow}>
          {showPrice ? (
            <Text style={[styles.priceLine, styles.priceLineInRow]}>
              {formatAnnouncementPriceLine(
                priceType ?? "PENDING",
                typeof price === "number" ? price : 0,
              )}
            </Text>
          ) : (
            <View style={styles.priceLineInRow} />
          )}
          {typeof viewCount === "number" ? (
            <Text style={styles.viewCountText}>조회 {viewCount}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.header}>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{type}</Text>
          </View>
          <View style={styles.statusTag}>
            <Text style={styles.statusTagText}>{status}</Text>
          </View>
          <Tag
            text={`D-${daysLeft}`}
            variant="countdown"
            borderRadius={6}
            daysLeft={daysLeft}
          />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.dateText}>2026.01.31</Text>
        </View>
      </View>
    </View>
  );
};

export default AnnouncementBox;
