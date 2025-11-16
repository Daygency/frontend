import { StyleSheet, Text, View } from "react-native";
import { WHITE } from "../color";

const ArtistScreen = () => {
  return (
    <View style={styles.container}>
      <Text>예술가</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
  },
});

export default ArtistScreen;

