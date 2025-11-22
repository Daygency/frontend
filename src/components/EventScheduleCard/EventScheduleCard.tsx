import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

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

export default EventScheduleCard;

