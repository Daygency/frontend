import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader from "../components/MainHomeHeader/MainHomeHeader";
import Logo from "../components/Logo/Logo";
import CategoryNavBar from "../components/CategoryNavBar/CategoryNavBar";

const MainHomeScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 29 }]}>
      <View style={styles.title_header}>
        <Logo size={24} />
      </View>
      <MainHomeHeader />
      <CategoryNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title_header: {
    paddingBottom: 15,
  },
});

export default MainHomeScreen;
