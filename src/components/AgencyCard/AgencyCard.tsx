import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK, GRAY } from "../../color";

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
          <MaterialCommunityIcons
            name="star-outline"
            size={16}
            color={BLACK}
          />
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
            styles={{ container: { paddingHorizontal: 0 } }}
            width={100}
            height={100}
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

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: BLACK,
    flex: 1,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  bookmarkCount: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
  },
  imageSection: {
    marginVertical: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "400",
    color: BLACK,
  },
});

export default AgencyCard;

