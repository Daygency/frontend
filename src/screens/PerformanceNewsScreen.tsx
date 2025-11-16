import { StyleSheet, Text, View } from "react-native";
import { WHITE } from "../color";

const PerformanceNewsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>공연소식</Text>
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

export default PerformanceNewsScreen;

