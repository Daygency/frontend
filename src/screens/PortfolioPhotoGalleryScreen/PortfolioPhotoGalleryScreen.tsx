import { ScrollView, View } from "react-native";
import Photo from "../../components/portfolio/Photo/Photo";
import styles from "./styles";

const PortfolioPhotoGalleryScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <Photo embedded />
      </ScrollView>
    </View>
  );
};

export default PortfolioPhotoGalleryScreen;
