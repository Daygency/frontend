import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import { WHITE } from "../color";
import AnnouncementDetail from "../screens/AnnouncementDetail/AnnouncementDetail";
import HeaderLeftButton from "../components/HeaderLeftButton/HeaderLeftButton";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

const MainHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: WHITE },
        headerShown: false,
      }}
    >
      <Stack.Screen name={HomeRoutes.MAIN_HOME} component={MainHomeScreen} />
      <Stack.Screen
        name={HomeRoutes.ANNOUNCEMENT_DETAIL}
        component={AnnouncementDetail}
        options={({ navigation }) => ({
          title: "모집 공고 상세",
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              hitSlop={10}
              style={{ marginLeft: 10 }}
            >
              <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default MainHomeStack;
