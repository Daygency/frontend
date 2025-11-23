import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK } from "../../color";
import styles from "./styles";

interface AgencyCardProps {
  title: string;
  likes: number;
  rating: number;
  calendarCount: number;
  bookmarkCount: number;
  tags: string[];
  images?: string[];
}

const AgencyCard = ({
  title,
  likes,
  rating,
  calendarCount,
  bookmarkCount,
  tags,
  images,
}: AgencyCardProps) => {
  const hasImages = images && images.length > 0;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.bookmarkContainer}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={20}
            color={BLACK}
          />
          <Text style={styles.bookmarkCount}>{bookmarkCount}</Text>
        </View>
      </View>

      {/* Engagement Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons
            name="thumb-up-outline"
            size={16}
            color={BLACK}
          />
          <Text style={styles.metricText}>{likes}</Text>
        </View>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="star-outline" size={16} color={BLACK} />
          <Text style={styles.metricText}>{rating}</Text>
        </View>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons
            name="calendar-outline"
            size={16}
            color={BLACK}
          />
          <Text style={styles.metricText}>{calendarCount}</Text>
        </View>
      </View>

      {/* Image Scroll Section - Only show if images exist */}
      {hasImages && (
        <View style={styles.imageSection}>
          <ImageScrollView
            styles={{ container: { paddingHorizontal: 12 } }}
            width={161}
            height={147}
            gap={8}
            images={images}
          />
        </View>
      )}

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

export default AgencyCard;
