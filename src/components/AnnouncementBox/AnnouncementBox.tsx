import { Text, View } from "react-native";
import Tag from "../Tag/Tag";
import styles from "./styles";
import { AnnouncementDetailParams } from "../../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";

const AnnouncementBox = ({
  title,
  type,
  status,
  daysLeft,
}: AnnouncementDetailParams) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.header}>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{type}</Text>
          </View>
          <View style={styles.statusTag}>
            <Text style={styles.statusTagText}>{status}</Text>
          </View>
          <Tag text={`D-${daysLeft}`} variant="countdown" borderRadius={6} />
        </View>
        <Text style={styles.dateText}>2026.01.31</Text>
      </View>
    </View>
  );
};

export default AnnouncementBox;
