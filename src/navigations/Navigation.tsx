import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import ContentTab from "./ContentTab";
import SocialLoginScreen from "../screens/OnboardingScreens/SocialLoginScreen/SocialLoginScreen";
import AccountReactivationScreen from "../screens/AccountReactivationScreen/AccountReactivationScreen";
import SignupFlowScreen from "../screens/OnboardingScreens/SignupFlowScreen/SignupFlowScreen";
import SplashScreenView from "../screens/OnboardingScreens/SplashScreen/SplashScreen";
import AnnouncementDetailScreen from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import ApplicationScreen from "../screens/ApplicationScreen/ApplicationScreen";
import FollowListScreen from "../screens/FollowListScreen/FollowListScreen";
import type { FollowListParams } from "../screens/FollowListScreen/types";
import CommunityDetailScreen from "../screens/CommunityDetailScreen";
import CommunityRegistrationScreen from "../screens/CommunityRegistrationScreen";
import AnnouncementRegistrationScreen from "../screens/AnnouncementRegistrationScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import MyInfoScreen from "../screens/SettingsScreens/MyInfoScreen/MyInfoScreen";
import MyActivityScreen from "../screens/SettingsScreens/MyActivityScreen/MyActivityScreen";
import MyActivityListScreen from "../screens/MyActivityListScreen/MyActivityListScreen";
import MyActivityNewsListScreen from "../screens/MyActivityNewsListScreen/MyActivityNewsListScreen";
import MyActivityAnnouncementListScreen from "../screens/MyActivityAnnouncementListScreen/MyActivityAnnouncementListScreen";
import ChangeNameScreen from "../screens/ChangeNameScreen/ChangeNameScreen";
import NotificationSettingsScreen from "../screens/SettingsScreens/NotificationSettingsScreen/NotificationSettingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen/NotificationsScreen";
import MyDataArchiveScreen from "../screens/SettingsScreens/MyDataArchiveScreen/MyDataArchiveScreen";
import CustomerServiceScreen from "../screens/SettingsScreens/CustomerServiceScreen/CustomerServiceScreen";
import InquiryScreen from "../screens/InquiryScreen/InquiryScreen";
import InquiryDetailScreen from "../screens/InquiryDetailScreen/InquiryDetailScreen";
import AccountScreen from "../screens/SettingsScreens/AccountScreen/AccountScreen";
import WithdrawConfirmScreen from "../screens/WithdrawConfirmScreen/WithdrawConfirmScreen";
import ChatRoomScreen from "../screens/ChatScreens/ChatRoomScreen/ChatRoomScreen";
import ChatRoomOptionsScreen from "../screens/ChatScreens/ChatRoomOptionsScreen/ChatRoomOptionsScreen";
import MyPostedChatRoomsScreen from "../screens/ChatScreens/MyPostedChatRoomsScreen/MyPostedChatRoomsScreen";
import AnnouncementApplicantsScreen from "../screens/AnnouncementApplicantsScreen/AnnouncementApplicantsScreen";
import ActivityReviewScreen from "../screens/ActivityReviewScreen/ActivityReviewScreen";
import ReceivedApplicationDetailScreen from "../screens/ReceivedApplicationDetailScreen/ReceivedApplicationDetailScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen/ProfileEditScreen";
import ArtistPortfolioScreen from "../screens/ArtistPortfolioScreen/ArtistPortfolioScreen";
import PortfolioPhotoGalleryScreen from "../screens/PortfolioPhotoGalleryScreen/PortfolioPhotoGalleryScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import MusicNewsDetailScreen from "../screens/MusicNewsDetailScreen/MusicNewsDetailScreen";
import MusicNewsRegistrationScreen from "../screens/MusicNewsRegistrationScreen";
import HomeBannerDetailScreen from "../screens/HomeBannerDetailScreen/HomeBannerDetailScreen";
import HomeBannerListScreen from "../screens/HomeBannerListScreen/HomeBannerListScreen";
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

  if (needsRoleSelection) {
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
          <Stack.Screen
            name={RootRoutes.ACCOUNT_REACTIVATION}
            component={AccountReactivationScreen}
            options={({ navigation }) => ({
              headerTitle: () => (
                <View style={styles.titleWrap}>
                  <Text style={styles.title}>계정 복구</Text>
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
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title} numberOfLines={1}>
                  {(route.params as FollowListParams | undefined)?.titleName
                    ? `${(route.params as FollowListParams).titleName} · 팔로우`
                    : "팔로잉 / 팔로워"}
                </Text>
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
          name={RootRoutes.ARTIST_PORTFOLIO}
          component={ArtistPortfolioScreen}
        />
        <Stack.Screen
          name={RootRoutes.PORTFOLIO_PHOTO_GALLERY}
          component={PortfolioPhotoGalleryScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>사진</Text>
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
        <Stack.Screen name={RootRoutes.SEARCH} component={SearchScreen} />
        <Stack.Screen
          name={RootRoutes.ANNOUNCEMENT_REGISTRATION}
          component={AnnouncementRegistrationScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>모집 공고 등록</Text>
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
          name={RootRoutes.HOME_BANNER_LIST}
          component={HomeBannerListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>큐레이션</Text>
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
          name={RootRoutes.HOME_BANNER_DETAIL}
          component={HomeBannerDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>큐레이션</Text>
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
          name={RootRoutes.MUSIC_NEWS_REGISTRATION}
          component={MusicNewsRegistrationScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>공연소식 등록</Text>
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
          name={RootRoutes.MUSIC_NEWS_DETAIL}
          component={MusicNewsDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>음악계 소식</Text>
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
          name={RootRoutes.NOTIFICATIONS}
          component={NotificationsScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>알림</Text>
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
          name={RootRoutes.MY_ACTIVITY_ANNOUNCEMENT_LIST}
          component={MyActivityAnnouncementListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text
                  style={[styles.title, { fontWeight: "700", fontSize: 18 }]}
                >
                  모집 공고
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
          name={RootRoutes.ACTIVITY_REVIEW}
          component={ActivityReviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.MY_POSTED_CHAT_ROOMS}
          component={MyPostedChatRoomsScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>내가 올린 공고</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) navigation.goBack();
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
          name={RootRoutes.ANNOUNCEMENT_APPLICANTS}
          component={AnnouncementApplicantsScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>지원 현황</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) navigation.goBack();
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
          name={RootRoutes.RECEIVED_APPLICATION_DETAIL}
          component={ReceivedApplicationDetailScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>지원서 확인</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "left",
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (navigation.canGoBack()) navigation.goBack();
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
          name={RootRoutes.CHAT_ROOM_OPTIONS}
          component={ChatRoomOptionsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RootRoutes.PROFILE_EDIT}
          component={ProfileEditScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>프로필 수정</Text>
              </View>
            ),
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: "center",
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
