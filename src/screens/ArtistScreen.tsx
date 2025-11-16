import { ScrollView, StyleSheet, View } from "react-native";
import { WHITE } from "../color";
import ArtistCard from "../components/ArtistCard/ArtistCard";

const ArtistScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
        </View>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
        </View>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
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

export default ArtistScreen;

