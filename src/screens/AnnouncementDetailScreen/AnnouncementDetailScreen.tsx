import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import HR from "../../components/HR/HR";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import RoundButton from "../../components/RoundButton/RoundButton";
import { RootRoutes } from "../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
};

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  Application: AnnouncementDetailParams;
};

type AnnouncementDetailRouteProp = RouteProp<
  RootStackParamList,
  typeof RootRoutes.ANNOUNCEMENT_DETAIL
>;

const AnnouncementDetailScreen = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { title, type, status, daysLeft } = route.params;
  const { width: screenWidth } = useWindowDimensions();
  const [imageHeights, setImageHeights] = useState<{ [key: number]: number }>(
    {}
  );
  const imageList = [
    "https://m.img24.com/web/product/big/202204/d9756600f4d10e085e427bfc3760492d.jpg",
    "https://m.img24.com/web/product/big/202204/d9756600f4d10e085e427bfc3760492d.jpg",
  ];

  const handleImageLoad = (index: number, event: any) => {
    const { width, height } = event.nativeEvent.source;
    const imageWidth = screenWidth - 58; // ShadowCardButton의 paddingHorizontal 15 * 2
    const aspectRatio = height / width;
    const calculatedHeight = imageWidth * aspectRatio;
    setImageHeights((prev) => ({ ...prev, [index]: calculatedHeight }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <AnnouncementBox
          title={title}
          type={type}
          status={status}
          daysLeft={daysLeft}
        />
        <View style={styles.cardWrap}>
          <ShadowCardButton styles={{container: { paddingHorizontal: 16, paddingVertical: 16 }}}>
            <View style={styles.producerInfo}>
              <RoundButton size={36} />
              <Text style={styles.producerName}>김프로듀서</Text>
            </View>
            <HR
              text=""
              styles={{
                container: { marginTop: 12 },
                line: { borderBottomColor: GRAY.MEDIUM_2 },
              }}
            />
            <View style={styles.infoContainer}>
              {/* 마감일 */}
              <View style={styles.infoWrap}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={16}
                  color={MAIN.DEFAULT}
                />
                <Text style={styles.infoTitle}>마감일:</Text>
                <Text style={styles.infoContent}>2025.09.06</Text>
              </View>
              {/* 예정일 */}
              <View style={styles.infoWrap}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={16}
                  color={MAIN.DEFAULT}
                />
                <Text style={styles.infoTitle}>예정일:</Text>
                <Text style={styles.infoContent}>2025.10.08</Text>
              </View>
              {/* 예정 시간 */}
              <View style={styles.infoWrap}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={MAIN.DEFAULT} />
                <Text style={styles.infoTitle}>예정 시간:</Text>
                <Text style={styles.infoContent}>14:30</Text>
              </View>
              {/* 장소 */}
              <View style={styles.infoWrap}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={16}
                  color={MAIN.DEFAULT}
                />
                <Text style={styles.infoTitle}>장소:</Text>
                <Text style={styles.infoContent}>세종문화회관 대극장</Text>
              </View>
              {/* 상태 */}
              <View style={styles.infoWrap}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 10,
                    backgroundColor: "#4CAF50",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons name="check" size={10} color={WHITE} />
                </View>
                <Text style={styles.tagAvailable}>모집 중</Text>
              </View>
            </View>
          </ShadowCardButton>
          <ShadowCardButton
            styles={{ container: { marginTop: 15, paddingTop: 16, paddingBottom: 20, paddingHorizontal: 16 } }}
          >
            <Text style={styles.cardTitle}>내용</Text>
            <View style={styles.cartWrap}>
              <Text style={styles.cardText}>
                뮤지컬 오페라의 유령 공연을 위한 오케스트라 단원을 모집합니다.
              </Text>
            </View>
            <View>
              {imageList.map((uri, index) => (
                <Pressable key={index} style={{ width: "100%" }}>
                  <Image
                    source={{ uri: uri }}
                    resizeMode="contain"
                    style={{
                      width: "100%",
                      height: imageHeights[index] || 200,
                      marginTop: 15,
                    }}
                    onLoad={(event) => handleImageLoad(index, event)}
                  />
                </Pressable>
              ))}
            </View>
          </ShadowCardButton>
        </View>
      </ScrollView>
      <View style={styles.applyContainer}>
        <Pressable
          style={styles.btnApply}
          onPress={() => {
            navigation.navigate(RootRoutes.APPLICATION, {
              title,
              type,
              status,
              daysLeft,
            });
          }}
        >
          <Text style={styles.btnApplyText}>지원서 작성하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AnnouncementDetailScreen;
