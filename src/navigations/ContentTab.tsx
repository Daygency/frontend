import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContentRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import ActivityScreen from "../screens/ActivityScreen/ActivityScreen";
import PaymentScreen from "../screens/PaymentScreen/PaymentScreen";
import ChatScreen from "../screens/ChatScreen/ChatScreen";
import LoungeScreen from "../screens/LoungeScreen/LoungeScreen";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={MainHomeScreen}
        options={{
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
          title: "홈",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.ACTIVITY}
        component={ActivityScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="track-light"
              size={24}
              color="black"
            />
          ),
          title: "내 활동",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PAYMENT}
        component={PaymentScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="wallet-outline" size={24} color="black" />
          ),
          title: "정산",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.CHAT}
        component={ChatScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          ),
          title: "채팅",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LOUNGE}
        component={LoungeScreen}
        options={{
          tabBarIcon: () => (
            <AntDesign name="comment" size={24} color="black" />
          ),
          title: "라운지",
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
