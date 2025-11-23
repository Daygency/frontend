import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import HR from "../../components/HR/HR";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import { GRAY } from "../../color";
import RoundButton from "../../components/RoundButton/RoundButton";

export type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
};

type MainHomeStackParamList = {
  MainHome: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
};

type AnnouncementDetailRouteProp = RouteProp<
  MainHomeStackParamList,
  "AnnouncementDetail"
>;

const AnnouncementDetailScreen = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
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
    <>
      <ScrollView>
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
    </>
  );
};

export default AnnouncementDetailScreen;
