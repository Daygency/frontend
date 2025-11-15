import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader from "../components/MainHomeHeader/MainHomeHeader";
import Logo from "../components/Logo/Logo";
import CategoryNavBar from "../components/CategoryNavBar/CategoryNavBar";
import ImageScrollView from "../components/ImageScrollView/ImageScrollView";
import Section from "../components/Section/Section";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, MAIN, WHITE } from "../color";
import SupplierList from "../components/SupplierList/SupplierList";

const MainHomeScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <View style={styles.title_header}>
        <Logo size={24} />
        <Pressable style={styles.portfolioButton}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="account" size={18} color={WHITE} />
          </View>
          <Text style={styles.portfolioTitle}>{"내 포트폴리오"}</Text>
        </Pressable>
      </View>
      <MainHomeHeader />
      <CategoryNavBar />
      <ImageScrollView styles={{ container: { marginBottom: 14 } }} />
      <SupplierList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title_header: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12 + 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  portfolioButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 40,
    backgroundColor: MAIN.DEFAULT,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portfolioTitle: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
    marginLeft: 22,
    lineHeight: 17,
  },
  icon: {
    position: "absolute",
    left: 8,
    // height: "100%",
    justifyContent: "center",
  },
});

export default MainHomeScreen;
