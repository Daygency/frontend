import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GRAY } from "../../color";
import styles from "./styles";

type CommunityPost = {
  id: string;
  tag: string;
  title: string;
  contentPreview: string;
  author?: string;
  date: string;
  likes: number;
  comments: number;
  scraps: number;
};

type CommunityDetailRouteParams = {
  post: CommunityPost;
};

type CommunityDetailRouteProp = RouteProp<
  { CommunityDetail: CommunityDetailRouteParams },
  "CommunityDetail"
>;

const CommunityDetailScreen = () => {
  const route = useRoute<CommunityDetailRouteProp>();
  const { post } = route.params;
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{post.tag}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.meta}>
            {post.author ?? "알수없음"} · {post.date}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyText}>{post.contentPreview}</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>좋아요 {post.likes}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.statText}>댓글 {post.comments}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.statText}>스크랩 {post.scraps}</Text>
        </View>

        <View style={styles.firstCommentPlaceholder}>
          <Text style={styles.firstCommentText}>첫 댓글을 남겨보세요.</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.commentInputContainer,
          { paddingBottom: (bottom || 0) + 10 },
        ]}
      >
        <View style={styles.anonymousToggle}>
          <View style={styles.checkbox} />
          <Text style={styles.anonymousText}>익명</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력해주세요"
            placeholderTextColor={GRAY.DARK_2}
            multiline
          />
        </View>
      </View>
    </View>
  );
};

export default CommunityDetailScreen;
