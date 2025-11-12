import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

const App = () => {
  return (
    <View>
      <StatusBar style="dark" />
      <Text style={{ fontSize: 30 }}>Daygency</Text>
    </View>
  );
};

export default App;
