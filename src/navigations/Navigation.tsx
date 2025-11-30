import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContentTab from "./ContentTab";
import AnnouncementDetailScreen from "../screens/AnnouncementDetailScreen/AnnouncementDetailScreen";
import ApplicationScreen from "../screens/ApplicationScreen/ApplicationScreen";
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
