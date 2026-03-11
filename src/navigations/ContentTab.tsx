import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContentRoutes } from "./routes";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import AnnouncementScreen from "../screens/AnnouncementScreen/AnnouncementScreen";
import ChatScreen from "../screens/ChatScreens/ChatScreen/ChatScreen";
import LoungeScreen from "../screens/LoungeScreen/LoungeScreen";
import PortfolioScreen from "../screens/PortfolioScreen/PortfolioScreen";
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
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={MainHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={24} color={focused ? "black" : "gray"} />
          ),
          title: "홈",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.ACTIVITY}
        component={AnnouncementScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="megaphone"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "모집공고",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PAYMENT}
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "채팅",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.CHAT}
        component={LoungeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="people"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "라운지",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LOUNGE}
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="notebook"
              size={24}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "포트폴리오",
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
