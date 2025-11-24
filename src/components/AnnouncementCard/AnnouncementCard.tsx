import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import Tag from "../Tag/Tag";
import styles from "./styles";

interface AnnouncementCardProps {
  title: string;
  type?: string;
  status?: string;
  daysLeft?: number;
  onPress?: () => void;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
  onPress,
}: AnnouncementCardProps) => {
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
      </View>
    </ShadowCardButton>
  );
};

export default AnnouncementCard;
