import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { AnnouncementListItem } from "../../../../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
} from "../../../../../lib/announcement/announcementDeadline";
import { announcementListRecruitmentStatus } from "../../../../../lib/announcement/announcementListStatus";
import { parseAnnouncementDaysLeft } from "../../../../../lib/announcement/parseAnnouncementDaysLeft";
import { sharedAnnouncementStyles } from "../../../../../components/shared/AnnouncementShared/sharedAnnouncementStyles";
import announcementCardStyles from "../../../../../components/cards/AnnouncementCard/styles";
import styles from "./myAnnouncementListItemStyles";

type Props = {
  item: AnnouncementListItem;
  onPress: () => void;
};

export default function MyAnnouncementListItem({ item, onPress }: Props) {
  const effectiveDaysLeft = effectiveAnnouncementDaysLeft(
    item.deadlineAt,
    parseAnnouncementDaysLeft(item.dDay),
  );
  const displayStatus = announcementListRecruitmentStatus(item);
  const isDeadlinePassed = isAnnouncementDeadlinePassed(
    effectiveDaysLeft,
    displayStatus,
  );
  const dDayLabel = formatAnnouncementDDayLabel(
    effectiveDaysLeft,
    displayStatus,
    item.completed,
  );

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.titleRow}>
        <View style={styles.titleWithCount}>
          <Text
            style={[announcementCardStyles.title, styles.title]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <View style={styles.personCount}>
            <MaterialIcons name="person" size={16} color="#9CA3AF" />
            <Text style={styles.personCountText}>
              {item.chatRoomCount ?? 0}
            </Text>
          </View>
        </View>
        <Text
          style={[
            sharedAnnouncementStyles.dDayText,
            announcementCardStyles.dDayOnRow,
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

      <View style={styles.tagsRow}>
        <View style={sharedAnnouncementStyles.typeTag}>
          <Text style={sharedAnnouncementStyles.typeTagText}>
            {item.type}
          </Text>
        </View>
        {(item.unreadCount ?? 0) > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {(item.unreadCount ?? 0) > 99 ? "99+" : String(item.unreadCount)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
