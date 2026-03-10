import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import ContentTab from "./ContentTab";
import SocialLoginScreen from "../screens/SocialLoginScreen/SocialLoginScreen";
import SignupFlowScreen from "../screens/SignupFlowScreen/SignupFlowScreen";
import SplashScreenView from "../components/SplashScreen/SplashScreen";
import AnnouncementDetailScreen from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import ApplicationScreen from "../screens/ApplicationScreen/ApplicationScreen";
import FollowListScreen from "../screens/FollowListScreen/FollowListScreen";
import CommunityDetailScreen from "../screens/CommunityDetailScreen";
import CommunityRegistrationScreen from "../screens/CommunityRegistrationScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import MyInfoScreen from "../screens/MyInfoScreen/MyInfoScreen";
import MyActivityScreen from "../screens/MyActivityScreen/MyActivityScreen";
import MyActivityListScreen from "../screens/MyActivityListScreen/MyActivityListScreen";
import MyActivityNewsListScreen from "../screens/MyActivityNewsListScreen/MyActivityNewsListScreen";
import ChangeNameScreen from "../screens/ChangeNameScreen/ChangeNameScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen/NotificationSettingsScreen";
import MyDataArchiveScreen from "../screens/MyDataArchiveScreen/MyDataArchiveScreen";
import CustomerServiceScreen from "../screens/CustomerServiceScreen/CustomerServiceScreen";
import InquiryScreen from "../screens/InquiryScreen/InquiryScreen";
import InquiryDetailScreen from "../screens/InquiryDetailScreen/InquiryDetailScreen";
import AccountScreen from "../screens/AccountScreen/AccountScreen";
import WithdrawConfirmScreen from "../screens/WithdrawConfirmScreen/WithdrawConfirmScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen/ChatRoomScreen";
import ChatRoomOptionsScreen from "../screens/ChatRoomOptionsScreen/ChatRoomOptionsScreen";
import { RootRoutes } from "./routes";
import { WHITE } from "../color";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isLoggedIn, isBrowsing, isLoading, needsRoleSelection } = useAuth();

  if (isLoading) {
    return <SplashScreenView />;
  }

  if (isLoggedIn && needsRoleSelection) {
    return (
      <NavigationContainer>
        <SignupFlowScreen />
      </NavigationContainer>
    );
  }

  if (!isLoggedIn && !isBrowsing) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: WHITE },
            headerShown: false,
          }}
        >
          <Stack.Screen name={RootRoutes.LOGIN} component={SocialLoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: WHITE },
          headerShown: false,
        }}
      >
        <Stack.Screen name={RootRoutes.CONTENT_TAB} component={ContentTab} />
        <Stack.Screen
          name={RootRoutes.ANNOUNCEMENT_DETAIL}
          component={AnnouncementDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>모집 공고 상세</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#000"
                />
              </Pressable>
            ),
            headerRight: () => (
              <View style={styles.rightItemsWrap}>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="bookmark-outline"
                    size={21}
                    color="#000"
                  />
                </Pressable>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={21}
                    color="#000"
                  />
                </Pressable>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={21}
                    color="#000"
                  />
                </Pressable>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name={RootRoutes.APPLICATION}
          component={ApplicationScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>지원하기</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.FOLLOW_LIST}
          component={FollowListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>팔로잉 / 팔로워</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.COMMUNITY_REGISTRATION}
          component={CommunityRegistrationScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>커뮤니티 등록</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.SETTINGS}
          component={SettingsScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>설정</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.COMMUNITY_DETAIL}
          component={CommunityDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>커뮤니티</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#000"
                />
              </Pressable>
            ),
            headerRight: () => (
              <View style={styles.rightItemsWrap}>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={21}
                    color="#000"
                  />
                </Pressable>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={21}
                    color="#000"
                  />
                </Pressable>
                <Pressable hitSlop={10}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={21}
                    color="#000"
                  />
                </Pressable>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name={RootRoutes.NOTIFICATION_SETTINGS}
          component={NotificationSettingsScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>알림 설정</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.MY_INFO}
          component={MyInfoScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>내 정보</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.MY_ACTIVITY_NEWS_LIST}
          component={MyActivityNewsListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text
                  style={[styles.title, { fontWeight: "700", fontSize: 18 }]}
                >
                  공연 소식
                </Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.MY_ACTIVITY_LIST}
          component={MyActivityListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text
                  style={[styles.title, { fontWeight: "700", fontSize: 18 }]}
                >
                  커뮤니티
                </Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.MY_ACTIVITY}
          component={MyActivityScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>내 활동</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.MY_DATA_ARCHIVE}
          component={MyDataArchiveScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text
                  style={[styles.title, { fontWeight: "700", fontSize: 18 }]}
                >
                  내 자료 보관함
                </Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={10}
                style={styles.leftIcon}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#000"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable hitSlop={10}>
                <Text style={{ fontSize: 16, color: "#000" }}>관리</Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name={RootRoutes.CUSTOMER_SERVICE}
          component={CustomerServiceScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>고객센터</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.INQUIRY}
          component={InquiryScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>문의하기</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.INQUIRY_DETAIL}
          component={InquiryDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>문의 상세</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.ACCOUNT}
          component={AccountScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>계정</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.WITHDRAW_CONFIRM}
          component={WithdrawConfirmScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>회원 탈퇴</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.CHANGE_NAME}
          component={ChangeNameScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>이름 변경</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                hitSlop={10}
                style={styles.leftIcon}
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
        <Stack.Screen
          name={RootRoutes.CHAT_ROOM}
          component={ChatRoomScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.CHAT_ROOM_OPTIONS}
          component={ChatRoomOptionsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
