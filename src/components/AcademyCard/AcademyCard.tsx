import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK, GRAY } from "../../color";

interface AcademyCardProps {
  title: string;
  likes: number;
  bookmarkCount: number;
  operatingHours: string;
  tags: string[];
  images?: string[];
}

const AcademyCard = ({
  title,
  likes,
  bookmarkCount,
  operatingHours,
  tags,
  images,
}: AcademyCardProps) => {
  const hasImages = images && images.length > 0;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons
              name="thumb-up-outline"
              size={16}
              color={BLACK}
            />
            <Text style={styles.likesText}>{likes}</Text>
          </View>
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

      {/* Operating Hours */}
      <Text style={styles.operatingHours}>운영 시간 : {operatingHours}</Text>

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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesText: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
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
  imageSection: {
    marginVertical: 8,
  },
  operatingHours: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
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

export default AcademyCard;

