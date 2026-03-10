import { StyleSheet, Text, View } from "react-native";
import { WHITE, MAIN } from "../../color";

const SplashScreenView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DAYGENCY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "700",
    color: MAIN.DEFAULT,
  },
});

export default SplashScreenView;
