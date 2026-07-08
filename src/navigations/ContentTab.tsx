import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { EventArg } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ContentRoutes } from "./routes";
import { fireTabRetap } from "../lib/navigation/tabRetap";
import MainHomeScreen from "../screens/MainHomeScreen/MainHomeScreen";
import AnnouncementScreen from "../screens/AnnouncementScreen/AnnouncementScreen";
import ChatScreen from "../screens/ChatScreens/ChatScreen/ChatScreen";
import LoungeScreen from "../screens/LoungeScreen/LoungeScreen";
import PortfolioScreen from "../screens/PortfolioScreen/PortfolioScreen";
import { useAuth } from "../contexts/AuthContext";
import { useChatUnread } from "../contexts/ChatUnreadContext";
import { getFcmToken } from "../lib/pushNotifications";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../color";

const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  paddingTop: 8,
  paddingBottom: 10,
  height: 90,
  backgroundColor: WHITE,
  borderTopWidth: 1,
  borderTopColor: GRAY.MEDIUM,
} as const;

const ContentTab = () => {
  const { isLoggedIn, requireLogin } = useAuth();
  const { unreadCount } = useChatUnread();

  const requireLoginOnTabPress = (
    e: EventArg<"tabPress", true, undefined>,
  ) => {
    if (isLoggedIn) return;
    e.preventDefault();
    requireLogin();
  };

  const retapSubTabListener = ({
    navigation,
    route,
  }: {
    navigation: { getState: () => { index: number; routes: { key: string }[] } };
    route: { key: string; name: string };
  }) => ({
    tabPress: () => {
      const state = navigation.getState();
      const focused = state.routes[state.index];
      if (focused.key === route.key) {
        fireTabRetap(route.name);
      }
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: MAIN.DEFAULT,
        tabBarInactiveTintColor: GRAY.MEDIUM_100,
      }}
      screenListeners={{
        tabPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={MainHomeScreen}
        listeners={retapSubTabListener}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          title: "홈",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.ACTIVITY}
        component={AnnouncementScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="megaphone" size={24} color={color} />
          ),
          title: "모집공고",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PAYMENT}
        component={ChatScreen}
        listeners={{ tabPress: requireLoginOnTabPress }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
          tabBarBadge: isLoggedIn && unreadCount > 0 ? unreadCount : undefined,
          title: "채팅",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.CHAT}
        component={LoungeScreen}
        listeners={retapSubTabListener}
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="people" size={24} color={color} />
          ),
          title: "라운지",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LOUNGE}
        component={PortfolioScreen}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              requireLoginOnTabPress(e);
              return;
            }
            void (async () => {
              const token = await getFcmToken();
              console.log("[FCM] device token:", token ?? "(null — 권한 없음 또는 네이티브 미지원)");
            })();
          },
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={24} color={color} />
          ),
          title: "포트폴리오",
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
