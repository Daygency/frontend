import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen";
import { WHITE } from "../color";
import SearchScreen from "../screens/SearchScreen";

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
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: "프로필",
          headerTitleStyle: {
            fontSize: 15,
          },
        }}
        name={HomeRoutes.SEARCH}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};

export default MainHomeStack;
