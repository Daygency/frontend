import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import ContentTab from "./ContentTab";
import LoginBottomSheet from "../screens/OnboardingScreens/SocialLoginScreen/LoginBottomSheet";
import AccountReactivationScreen from "../screens/AccountReactivationScreen/AccountReactivationScreen";
import SignupFlowScreen from "../screens/OnboardingScreens/SignupFlowScreen/SignupFlowScreen";
import SplashScreenView from "../screens/OnboardingScreens/SplashScreen/SplashScreen";
import AnnouncementDetailScreen from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import ApplicationScreen from "../screens/ApplicationScreen/ApplicationScreen";
import ApplicationStatusListScreen from "../screens/ApplicationStatusListScreen/ApplicationStatusListScreen";
import MyAnnouncementStatusListScreen from "../screens/MyAnnouncementStatusListScreen/MyAnnouncementStatusListScreen";
import FollowListScreen from "../screens/FollowListScreen/FollowListScreen";
import type { FollowListParams } from "../screens/FollowListScreen/types";
import CommunityDetailScreen from "../screens/CommunityDetailScreen";
import CommunityRegistrationScreen from "../screens/CommunityRegistrationScreen";
import AnnouncementRegistrationScreen from "../screens/AnnouncementRegistrationScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import MyActivityScreen from "../screens/SettingsScreens/MyActivityScreen/MyActivityScreen";
import MyActivityListScreen from "../screens/MyActivityListScreen/MyActivityListScreen";
import MyActivityNewsListScreen from "../screens/MyActivityNewsListScreen/MyActivityNewsListScreen";
import MyActivityLikedCommentsListScreen from "../screens/MyActivityLikedCommentsListScreen/MyActivityLikedCommentsListScreen";
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
import ChatFileArchiveScreen from "../screens/ChatScreens/ChatFileArchiveScreen/ChatFileArchiveScreen";
import PdfViewerScreen from "../screens/PdfViewerScreen/PdfViewerScreen";
import AnnouncementApplicantsScreen from "../screens/AnnouncementApplicantsScreen/AnnouncementApplicantsScreen";
import ActivityReviewScreen from "../screens/ActivityReviewScreen/ActivityReviewScreen";
import ReceivedApplicationDetailScreen from "../screens/ReceivedApplicationDetailScreen/ReceivedApplicationDetailScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen/ProfileEditScreen";
import ArtistPortfolioScreen from "../screens/ArtistPortfolioScreen/ArtistPortfolioScreen";
import PortfolioPhotoGalleryScreen from "../screens/PortfolioPhotoGalleryScreen/PortfolioPhotoGalleryScreen";
import ReceivedReviewsScreen from "../screens/ReceivedReviewsScreen/ReceivedReviewsScreen";
import ReviewTagSummaryListScreen from "../screens/ReviewTagSummaryListScreen/ReviewTagSummaryListScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import MusicNewsDetailScreen from "../screens/MusicNewsDetailScreen/MusicNewsDetailScreen";
import MusicNewsRegistrationScreen from "../screens/MusicNewsRegistrationScreen";
import HomeBannerDetailScreen from "../screens/HomeBannerDetailScreen/HomeBannerDetailScreen";
import HomeBannerListScreen from "../screens/HomeBannerListScreen/HomeBannerListScreen";
import { RootRoutes } from "./routes";
import { withAuthGate } from "../hooks/useRequireLogin";
import { WHITE } from "../color";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const Stack = createNativeStackNavigator();

const accountReactivationScreenOptions = ({ navigation }: { navigation: any }) => ({
  headerTitle: () => (
    <View style={styles.titleWrap}>
      <Text style={styles.title}>계정 복구</Text>
    </View>
  ),
  headerShadowVisible: false,
  headerShown: true,
  headerTitleAlign: "left" as const,
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
      <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
    </Pressable>
  ),
});

const Navigation = () => {
  const { isLoggedIn, isBrowsing, isLoading, needsRoleSelection, enterBrowse } =
    useAuth();

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

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: WHITE },
          headerShown: false,
        }}
      >
        <Stack.Screen name={RootRoutes.CONTENT_TAB} component={ContentTab} />
        <Stack.Screen
          name={RootRoutes.ACCOUNT_REACTIVATION}
          component={AccountReactivationScreen}
          options={accountReactivationScreenOptions}
        />
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
          })}
        />
        <Stack.Screen
          name={RootRoutes.APPLICATION}
          component={withAuthGate(ApplicationScreen)}
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
          name={RootRoutes.APPLICATION_STATUS_LIST}
          component={withAuthGate(ApplicationStatusListScreen)}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title} numberOfLines={1}>
                  지원 현황
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
          name={RootRoutes.MY_ANNOUNCEMENT_STATUS_LIST}
          component={withAuthGate(MyAnnouncementStatusListScreen)}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title} numberOfLines={1}>
                  내가 만든 공고
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
          component={withAuthGate(PortfolioPhotoGalleryScreen)}
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
        <Stack.Screen
          name={RootRoutes.RECEIVED_REVIEWS}
          component={ReceivedReviewsScreen}
          options={({ navigation }) => ({
            headerTitle: "받은 후기",
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
          name={RootRoutes.REVIEW_TAG_SUMMARY_LIST}
          component={ReviewTagSummaryListScreen}
          options={({ navigation }) => ({
            headerTitle: "받은 후기 태그",
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
          component={withAuthGate(AnnouncementRegistrationScreen)}
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
                <Text style={styles.title}>매거진</Text>
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
                <Text style={styles.title}>매거진</Text>
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
          component={withAuthGate(MusicNewsRegistrationScreen)}
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
          component={withAuthGate(CommunityRegistrationScreen)}
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
          component={withAuthGate(SettingsScreen)}
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
                <Text style={styles.title}>공연소식</Text>
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
          component={withAuthGate(NotificationSettingsScreen)}
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
          component={withAuthGate(NotificationsScreen)}
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
          name={RootRoutes.MY_ACTIVITY_NEWS_LIST}
          component={withAuthGate(MyActivityNewsListScreen)}
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
          component={withAuthGate(MyActivityListScreen)}
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
          name={RootRoutes.MY_ACTIVITY_LIKED_COMMENTS_LIST}
          component={withAuthGate(MyActivityLikedCommentsListScreen)}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text
                  style={[styles.title, { fontWeight: "700", fontSize: 18 }]}
                >
                  댓글
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
          component={withAuthGate(MyActivityAnnouncementListScreen)}
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
          component={withAuthGate(MyDataArchiveScreen)}
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
          component={withAuthGate(CustomerServiceScreen)}
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
          component={withAuthGate(InquiryScreen)}
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
          component={withAuthGate(InquiryDetailScreen)}
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
          component={withAuthGate(AccountScreen)}
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
          component={withAuthGate(WithdrawConfirmScreen)}
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
          component={withAuthGate(ChangeNameScreen)}
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
          component={withAuthGate(ChatRoomScreen)}
          options={{ headerShown: false, keyboardHandlingEnabled: false }}
        />
        <Stack.Screen
          name={RootRoutes.CHAT_FILE_ARCHIVE}
          component={withAuthGate(ChatFileArchiveScreen)}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>채팅 보관함</Text>
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
          name={RootRoutes.PDF_VIEWER}
          component={withAuthGate(PdfViewerScreen)}
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={styles.title}>
                  {(route.params as { title?: string } | undefined)?.title ??
                    "파일 보기"}
                </Text>
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
          name={RootRoutes.ACTIVITY_REVIEW}
          component={withAuthGate(ActivityReviewScreen)}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.ANNOUNCEMENT_APPLICANTS}
          component={withAuthGate(AnnouncementApplicantsScreen)}
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
          component={withAuthGate(ReceivedApplicationDetailScreen)}
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
          component={withAuthGate(ChatRoomOptionsScreen)}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RootRoutes.PROFILE_EDIT}
          component={withAuthGate(ProfileEditScreen)}
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
        {!isLoggedIn && !isBrowsing ? (
          <LoginBottomSheet onDismiss={enterBrowse} />
        ) : null}
      </View>
    </NavigationContainer>
  );
};

export default Navigation;
