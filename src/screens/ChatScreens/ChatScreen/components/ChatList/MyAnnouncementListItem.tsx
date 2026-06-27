import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { AnnouncementListItem } from "../../../../../lib/apis/announcement/types";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementDeadlinePassed,
} from "../../../../../lib/announcement/announcementDeadline";
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
  const displayStatus =
    effectiveDaysLeft < 0
      ? "모집마감"
      : item.isRecruiting
        ? "모집중"
        : "모집마감";
  const isDeadlinePassed = isAnnouncementDeadlinePassed(
    effectiveDaysLeft,
    displayStatus,
  );
  const dDayLabel = formatAnnouncementDDayLabel(
    effectiveDaysLeft,
    displayStatus,
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
        <View style={sharedAnnouncementStyles.statusTag}>
          <Text style={sharedAnnouncementStyles.statusTagText}>
            {displayStatus}
          </Text>
        </View>
        <View style={sharedAnnouncementStyles.typeTag}>
          <Text style={sharedAnnouncementStyles.typeTagText}>
            {item.type}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
