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
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import RoundButton from "../../components/RoundButton/RoundButton";
import { RootRoutes } from "../../navigations/routes";
import styles from "./styles";

export type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
  postId?: string;
  postedDate?: string;
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

  const attachmentList = [
    { name: "모집공고_상세안내.pdf", size: "2.4 MB" },
    { name: "오디션_곡목.pdf", size: "1.1 MB" },
  ];

  const handleImageLoad = (index: number, event: any) => {
    const { width, height } = event.nativeEvent.source;
    const imageWidth = screenWidth - 40;
    const aspectRatio = height / width;
    const calculatedHeight = imageWidth * aspectRatio;
    setImageHeights((prev) => ({ ...prev, [index]: calculatedHeight }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.dividerThick} />
        <AnnouncementBox
          title={title}
          type={type}
          status={status}
          daysLeft={daysLeft}
        />
        <View style={styles.dividerThick} />
        <View style={styles.section}>
          <View style={styles.producerInfo}>
            <RoundButton size={36} />
            <Text style={styles.producerName}>@kimproducer</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>마감일 : </Text>
              <Text style={styles.infoValue}>2025.09.06</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>예정일 : </Text>
              <Text style={styles.infoValue}>2025.10.08</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>예정 시간 : </Text>
              <Text style={styles.infoValue}>14:30</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>장소 : </Text>
              <Text style={styles.infoValue}>세종문화회관 대극장</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons name="check" size={10} color={WHITE} />
              </View>
              <Text style={styles.statusText}>모집 중</Text>
            </View>
          </View>
        </View>
        <View style={styles.dividerThick} />
        <View style={styles.section}>
          <Text style={styles.descriptionText}>
            {"뮤지컬 <오페라의 유령> 공연을 위한 오케스트라 단원을 모집합니다."}
          </Text>
          {imageList.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              resizeMode="cover"
              style={[
                styles.contentImage,
                { height: imageHeights[index] || 200 },
              ]}
              onLoad={(event) => handleImageLoad(index, event)}
            />
          ))}
        </View>
        <View style={styles.dividerThick} />
        <View style={styles.section}>
          <Text style={styles.attachmentTitle}>첨부파일</Text>
          {attachmentList.map((file, index) => (
            <Pressable
              key={index}
              style={styles.attachmentCard}
              onPress={() => {}}
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={20}
                color={MAIN.DEFAULT}
              />
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentFileName}>{file.name}</Text>
                <Text style={styles.attachmentFileSize}>{file.size}</Text>
              </View>
              <MaterialCommunityIcons
                name="download"
                size={22}
                color={MAIN.DEFAULT}
              />
            </Pressable>
          ))}
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
