import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContentRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import ActivityScreen from "../screens/ActivityScreen/ActivityScreen";
import PaymentScreen from "../screens/PaymentScreen/PaymentScreen";
import ChatScreen from "../screens/ChatScreen/ChatScreen";
import LoungeScreen from "../screens/LoungeScreen/LoungeScreen";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 10,
          height: 90,
        },
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={MainHomeScreen}
        options={{
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
          title: "홈",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.ACTIVITY}
        component={ActivityScreen}
        options={{
          tabBarIcon: () => <Entypo name="megaphone" size={24} color="black" />,
          title: "모집공고",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PAYMENT}
        component={PaymentScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          ),
          title: "채팅",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.CHAT}
        component={ChatScreen}
        options={{
          tabBarIcon: () => <Octicons name="people" size={24} color="black" />,
          title: "라운지",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LOUNGE}
        component={LoungeScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="notebook" size={24} color="black" />
          ),
          title: "포트폴리오",
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
