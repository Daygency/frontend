import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";

const LoungeScreen = () => {
  const { top } = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar />
      <Text>Lounge</Text>
    </View>
  );
};

export default LoungeScreen;
