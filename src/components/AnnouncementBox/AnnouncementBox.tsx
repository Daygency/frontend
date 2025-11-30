import { Text, View } from "react-native";
import Tag from "../Tag/Tag";
import styles from "./styles";
import { AnnouncementDetailParams } from "../../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import { GRAY, MAIN } from "../../color";

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
          <Tag text={type} variant="type" borderColor={GRAY.DARK_1} />
          <Tag text={status} variant="status" borderColor={GRAY.MEDIUM_2} />
          <Tag
            text={`D-${daysLeft}`}
            variant="countdown"
            borderColor={MAIN.DEFAULT}
          />
        </View>
      </View>
    </View>
  );
};

export default AnnouncementBox;
