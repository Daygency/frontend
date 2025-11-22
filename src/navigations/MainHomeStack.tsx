import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import { WHITE } from "../color";

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
    </Stack.Navigator>
  );
};

export default MainHomeStack;
