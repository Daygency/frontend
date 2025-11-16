import { StyleSheet, Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, WHITE } from "../../color";

interface EventScheduleCardProps {
  title: string;
  daysLeft: string;
}

const EventScheduleCard = ({ title, daysLeft }: EventScheduleCardProps) => {
  return (
    <ShadowCardButton>
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{title}</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{daysLeft}</Text>
        </View>
      </View>
    </ShadowCardButton>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "400",
  },
  dateBadge: {
    backgroundColor: BLACK,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default EventScheduleCard;

