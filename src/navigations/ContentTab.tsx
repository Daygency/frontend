import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContentRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen";
import ActivityScreen from "../screens/ActivityScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ChatScreen from "../screens/ChatScreen";
import LoungeScreen from "../screens/LoungeScreen";

const Tab = createBottomTabNavigator();

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={ContentRoutes.HOME} component={MainHomeScreen} />
      <Tab.Screen name={ContentRoutes.ACTIVITY} component={ActivityScreen} />
      <Tab.Screen name={ContentRoutes.PAYMENT} component={PaymentScreen} />
      <Tab.Screen name={ContentRoutes.CHAT} component={ChatScreen} />
      <Tab.Screen name={ContentRoutes.LOUNGE} component={LoungeScreen} />
    </Tab.Navigator>
  );
};

export default ContentTab;
