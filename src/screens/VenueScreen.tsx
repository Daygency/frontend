import { ScrollView, StyleSheet, View } from "react-native";
import { WHITE } from "../color";
import VenueCard from "../components/VenueCard/VenueCard";

const VenueScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <VenueCard
            title="거암 아트홀"
            address="서울 강남구 신사동"
            bookmarkCount={54}
            tags={[
              "주차가능",
              "강남역 도보1분",
              "스타인웨이 보유",
              "조명감독 상주",
            ]}
          />
        </View>
        <View style={styles.cardWrapper}>
          <VenueCard
            title="거암 아트홀"
            address="서울 강남구 신사동"
            bookmarkCount={54}
            tags={[
              "주차가능",
              "강남역 도보1분",
              "스타인웨이 보유",
              "조명감독 상주",
              "주차가능",
            ]}
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

export default VenueScreen;

