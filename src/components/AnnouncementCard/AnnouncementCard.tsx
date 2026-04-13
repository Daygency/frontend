import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import Tag from "../Tag/Tag";
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
  onPress?: () => void;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
  priceType,
  price,
  onPress,
}: AnnouncementCardProps) => {
  const showPrice =
    priceType !== undefined ||
    (typeof price === "number" && Number.isFinite(price));

  return (
    <ShadowCardButton onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {/* <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>D-{daysLeft}</Text>
          </View> */}
          <View style={styles.tagsContainer}>
            {/* <Tag text={type} variant="type" /> */}
            {/* <Tag text={status} variant="status" /> */}
          </View>
          <Tag text={`D-${daysLeft}`} variant="countdown" />
        </View>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{type}</Text>
          </View>
          <View style={styles.statusTag}>
            <Text style={styles.statusTagText}>{status}</Text>
          </View>
        </View>
        {showPrice ? (
          <Text style={styles.priceLine} numberOfLines={2}>
            {formatAnnouncementPriceLineList(
              priceType ?? "FREE",
              typeof price === "number" ? price : 0,
            )}
          </Text>
        ) : null}
      </View>
    </ShadowCardButton>
  );
};

export default AnnouncementCard;
