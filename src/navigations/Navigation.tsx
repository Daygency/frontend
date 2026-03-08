import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContentTab from "./ContentTab";
import AnnouncementDetailScreen from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import ApplicationScreen from "../screens/ApplicationScreen/ApplicationScreen";
import FollowListScreen from "../screens/FollowListScreen/FollowListScreen";
import CommunityDetailScreen from "../screens/CommunityDetailScreen";
import CommunityRegistrationScreen from "../screens/CommunityRegistrationScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import MyInfoScreen from "../screens/MyInfoScreen/MyInfoScreen";
import MyActivityScreen from "../screens/MyActivityScreen/MyActivityScreen";
import MyActivityListScreen from "../screens/MyActivityListScreen/MyActivityListScreen";
import ChangeNameScreen from "../screens/ChangeNameScreen/ChangeNameScreen";
import { RootRoutes } from "./routes";
import { WHITE } from "../color";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const Stack = createNativeStackNavigator();

const Navigation = () => {
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
          name={RootRoutes.MY_ACTIVITY_LIST}
          component={MyActivityListScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.titleWrap}>
                <Text style={[styles.title, { fontWeight: "700", fontSize: 18 }]}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
