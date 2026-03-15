import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  Text,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, WHITE } from "../../color";
import CommentInputBar from "../../components/CommentInputBar/CommentInputBar";
import styles from "./styles";

export type MusicNewsDetailItem = {
  id: string;
  title: string;
  place: string;
  date: string;
  time: string;
  contact: string;
  authorId?: string;
  uploadedAt: string;
  description: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  attachments?: { name: string; size: string }[];
};

type MusicNewsDetailRouteParams = {
  news: MusicNewsDetailItem;
};

type MusicNewsDetailRouteProp = RouteProp<
  { MusicNewsDetail: MusicNewsDetailRouteParams },
  "MusicNewsDetail"
>;

const MOCK_NEWS: MusicNewsDetailItem = {
  id: "1",
  title: "2025 봄 정기 연주회",
  place: "세종문화회관 대극장",
  date: "2025.10.08",
  time: "14:30",
  contact: "02-358-8479",
  authorId: "@아이디",
  uploadedAt: "2026.01.31",
  description:
    "봄 정기 연주회, 따뜻한 선율로 여러분을 초대합니다! 봄의 빛처럼 피어나는 음악을 무대에서 만나보세요",
  likes: 45,
  comments: 5,
  attachments: [
    { name: "모집공고_상세안내.pdf", size: "2.4 MB" },
    { name: "오디션_곡목.pdf", size: "1.1 MB" },
  ],
};

const MusicNewsDetailScreen = () => {
  const route = useRoute<MusicNewsDetailRouteProp>();
  const { bottom } = useSafeAreaInsets();
  const news = route.params?.news ?? MOCK_NEWS;
  const { width } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posterWrapper}>
          <Image
            source={{
              uri: news.imageUrl || "https://via.placeholder.com/400x240?text=CLASSIC+ARTIST+CONCERT",
            }}
            style={[styles.posterImage, { width, height: width * 0.6 }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.uploadedAt}>{news.uploadedAt}</Text>
          </View>

          <View style={styles.infoCard}>
            {news.authorId && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={18}
                  color={GRAY.DARK}
                />
                <Text style={styles.infoText}>{news.authorId}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>예정일 : {news.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>예정 시간 : {news.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>장소: {news.place}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={18}
                color={GRAY.DARK}
              />
              <Text style={styles.infoText}>문의: {news.contact}</Text>
            </View>
          </View>

          <Text style={styles.description}>{news.description}</Text>

          {news.attachments && news.attachments.length > 0 && (
            <View style={styles.attachmentsCard}>
              <Text style={styles.attachmentsTitle}>첨부파일</Text>
              {news.attachments.map((file, index) => (
                <Pressable key={index} style={styles.fileRow}>
                  <MaterialCommunityIcons
                    name="paperclip"
                    size={18}
                    color={GRAY.DARK}
                  />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>{file.size}</Text>
                  <MaterialCommunityIcons
                    name="download"
                    size={20}
                    color={GRAY.DARK}
                  />
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={18}
              color={GRAY.DARK}
            />
            <Text style={styles.statText}>좋아요 {news.likes}</Text>
            <MaterialCommunityIcons
              name="comment-outline"
              size={18}
              color={GRAY.DARK}
              style={styles.statIcon}
            />
            <Text style={styles.statText}>댓글 {news.comments}</Text>
          </View>

          <View style={styles.firstCommentPlaceholder}>
            <Text style={styles.firstCommentText}>첫 댓글을 남겨보세요.</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.commentInputWrapper,
          { paddingBottom: (bottom || 0) + 10 },
        ]}
      >
        <CommentInputBar placeholder="댓글을 입력하세요" />
      </View>
    </View>
  );
};

export default MusicNewsDetailScreen;
