import { ScrollView, StyleSheet, View } from "react-native";
import { WHITE } from "../color";
import AcademyCard from "../components/AcademyCard/AcademyCard";

const AcademyScreen = () => {
  // Sample data with images
  const academyWithImages = {
    title: "반포음악학원",
    likes: 24,
    bookmarkCount: 54,
    operatingHours: "10:00 ~ 20:00",
    tags: ["클래식", "기획공연", "신인연주회"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    ],
  };

  // Sample data without images
  const academyWithoutImages = {
    title: "반포음악학원",
    likes: 24,
    bookmarkCount: 54,
    operatingHours: "10:00 ~ 20:00",
    tags: ["클래식", "기획공연", "신인연주회"],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <AcademyCard
            title={academyWithImages.title}
            likes={academyWithImages.likes}
            bookmarkCount={academyWithImages.bookmarkCount}
            operatingHours={academyWithImages.operatingHours}
            tags={academyWithImages.tags}
            images={academyWithImages.images}
          />
        </View>
        <View style={styles.cardWrapper}>
          <AcademyCard
            title={academyWithoutImages.title}
            likes={academyWithoutImages.likes}
            bookmarkCount={academyWithoutImages.bookmarkCount}
            operatingHours={academyWithoutImages.operatingHours}
            tags={academyWithoutImages.tags}
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

export default AcademyScreen;

