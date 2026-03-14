import { Text, View } from "react-native";
import Tag from "../Tag/Tag";
import styles from "./styles";
import { AnnouncementDetailParams } from "../../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import { MAIN } from "../../color";

const BEIGE_TAG_BG = "#F5E6D3";

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
          <Tag
            text={type}
            variant="type"
            backgroundColor={BEIGE_TAG_BG}
            textColor="#333"
            borderRadius={100}
          />
          <Tag
            text={status}
            variant="type"
            backgroundColor={BEIGE_TAG_BG}
            textColor="#333"
            borderRadius={100}
          />
          <Tag
            text={`D-${daysLeft}`}
            variant="countdown"
            borderRadius={100}
          />
        </View>
        <Text style={styles.dateText}>2026.01.31</Text>
      </View>
    </View>
  );
};

export default AnnouncementBox;
