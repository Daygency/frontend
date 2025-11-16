import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import { BLACK, GRAY } from "../../color";

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
          styles={{ container: { paddingHorizontal: 0 } }}
          width={100}
          height={100}
          gap={8}
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
  address: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
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

export default VenueCard;

