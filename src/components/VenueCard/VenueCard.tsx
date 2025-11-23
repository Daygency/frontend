import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK } from "../../color";
import styles from "./styles";

interface VenueCardProps {
  title: string;
  address: string;
  bookmarkCount: number;
  tags: string[];
}

const VenueCard = ({
  title,
  address,
  bookmarkCount,
  tags,
}: VenueCardProps) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <View style={styles.bookmarkContainer}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={20}
            color={BLACK}
          />
          <Text style={styles.bookmarkCount}>{bookmarkCount}</Text>
        </View>
      </View>

      {/* Image Scroll Section */}
      <View style={styles.imageSection}>
        <ImageScrollView
          styles={{ container: { paddingHorizontal: 12 } }}
          width={160}
          height={147}
          gap={5}
        />
      </View>

      {/* Tags Section */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default VenueCard;

