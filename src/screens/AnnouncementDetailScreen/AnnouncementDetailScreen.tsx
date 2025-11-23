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
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import HR from "../../components/HR/HR";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import RoundButton from "../../components/RoundButton/RoundButton";
import { RootRoutes } from "../../navigations/routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    const imageWidth = screenWidth - 30; // ShadowCardButton의 paddingHorizontal 15 * 2
    const aspectRatio = height / width;
    const calculatedHeight = imageWidth * aspectRatio;
    setImageHeights((prev) => ({ ...prev, [index]: calculatedHeight }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <AnnouncementBox
          title={title}
          type={type}
          status={status}
          daysLeft={daysLeft}
        />
        <ShadowCardButton>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <RoundButton size={40} />
            <Text>김 프로듀서</Text>
          </View>
          <HR
            text=""
            styles={{
              container: { marginTop: 12 },
              line: { borderBottomColor: GRAY.MEDIUM },
            }}
          />
        </ShadowCardButton>
        <ShadowCardButton
          styles={{ container: { marginTop: 15, padding: 16 } }}
        >
          <Text style={{ fontWeight: "600", fontSize: 15 }}>내용</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "400", fontSize: 14 }}>
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
                  }}
                  onLoad={(event) => handleImageLoad(index, event)}
                />
              </Pressable>
            ))}
          </View>
        </ShadowCardButton>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 20,
          backgroundColor: WHITE,
        }}
      >
        <Pressable
          style={{
            backgroundColor: MAIN.DEFAULT,
            borderRadius: 16,
            paddingVertical: 16,
            bottom: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate(RootRoutes.APPLICATION, {
              title,
              type,
              status,
              daysLeft,
            });
          }}
        >
          <Text style={{ color: WHITE, fontSize: 16, fontWeight: "600" }}>
            지원서 작성하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AnnouncementDetailScreen;
