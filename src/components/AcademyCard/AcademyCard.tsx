import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK } from "../../color";
import styles from "./styles";

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
export default AcademyCard;
