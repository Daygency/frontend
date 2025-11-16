import { ScrollView, StyleSheet, View } from "react-native";
import { WHITE } from "../color";
import AgencyCard from "../components/AgencyCard/AgencyCard";

const AgencyScreen = () => {
  // Sample data with images
  const agencyWithImages = {
    title: "MY아트기획",
    likes: 24,
    rating: 4.8,
    calendarCount: 15,
    bookmarkCount: 54,
    tags: ["클래식", "기획공연", "신인연주회"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    ],
  };

  // Sample data without images
  const agencyWithoutImages = {
    title: "MY아트기획",
    likes: 24,
    rating: 4.8,
    calendarCount: 15,
    bookmarkCount: 54,
    tags: ["클래식", "기획공연", "신인연주회"],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <AgencyCard
            title={agencyWithImages.title}
            likes={agencyWithImages.likes}
            rating={agencyWithImages.rating}
            calendarCount={agencyWithImages.calendarCount}
            bookmarkCount={agencyWithImages.bookmarkCount}
            tags={agencyWithImages.tags}
            images={agencyWithImages.images}
          />
        </View>
        <View style={styles.cardWrapper}>
          <AgencyCard
            title={agencyWithoutImages.title}
            likes={agencyWithoutImages.likes}
            rating={agencyWithoutImages.rating}
            calendarCount={agencyWithoutImages.calendarCount}
            bookmarkCount={agencyWithoutImages.bookmarkCount}
            tags={agencyWithoutImages.tags}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default AgencyScreen;

