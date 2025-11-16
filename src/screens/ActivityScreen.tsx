import { StyleSheet, Text, View } from "react-native";
import { WHITE } from "../color";

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Activity</Text>
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

export default ActivityScreen;
