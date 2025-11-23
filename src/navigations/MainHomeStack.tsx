import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import { WHITE } from "../color";
import AnnouncementDetail from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import { Pressable, Text, View } from "react-native";
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
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 25,
              }}
            >
              <Text
                style={{ fontSize: 17, fontWeight: "bold", marginLeft: -10 }}
              >
                모집 공고 상세
              </Text>
            </View>
          ),
          headerShadowVisible: false,
          headerShown: true,
          headerTitleAlign: "left", // 타이틀 왼쪽 정렬
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
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color="#000"
              />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default MainHomeStack;
