import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

const MainHomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>Main Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainHomeScreen;
