import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BLACK, GRAY, RED } from "../../../color";

type CommunityCardProps = {
  tag?: string;
  title: string;
  contentPreview: string;
  author?: string;
  date: string;
  likes: number;
  comments: number;
  scraps?: number;
  views?: number;
  onPress?: () => void;
};

const CommunityCard = ({
  tag,
  title,
  contentPreview,
  author = "알수없음",
  date,
  likes,
  comments,
  scraps = 0,
  views,
  onPress,
}: CommunityCardProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          {!!tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText} numberOfLines={1}>
                {tag}
              </Text>
            </View>
          )}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.content} numberOfLines={2}>
            {contentPreview}
          </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            ({author})  {date}
          </Text>
        </View>
        <View style={styles.thumbnail} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="heart" size={16} color={RED.DEFAULT} />
          <Text style={styles.footerText}>{likes}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={GRAY.DARK_100} />
          <Text style={styles.footerText}>{comments}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons
            name={views != null ? "eye-outline" : "bookmark-outline"}
            size={16}
            color={GRAY.DARK_100}
          />
          <Text style={styles.footerText}>{views ?? scraps}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: GRAY.MEDIUM,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: BLACK,
    fontWeight: "500",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
  },
  content: {
    fontSize: 13,
    fontWeight: "400",
    color: GRAY.DARK_100,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: GRAY.DARK_2,
  },
  thumbnail: {
    width: 64,
    height: 64,
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: GRAY.MEDIUM,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  footerText: {
    fontSize: 12,
    color: GRAY.DARK_100,
    marginLeft: 4,
  },
});

export default CommunityCard;

