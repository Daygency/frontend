import { FlatList, Pressable, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ChatItem from "../ChatScreen/components/ChatItem/ChatItem";
import styles from "./styles";
import { RootRoutes } from "../../../navigations/routes";

type Params = {
  postId: string;
  title: string;
  // mock 용도: 화면 상단에 보여줄 값들
  typeTag?: string;
  statusTag?: string;
  dDay?: string;
};

type RouteParams = RouteProp<{ MyPostedChatRooms: Params }, "MyPostedChatRooms">;

const MOCK_ROOMS_BY_POST_ID: Record<
  string,
  {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isOnline?: boolean;
    isMusic?: boolean;
    isVerified?: boolean;
  }[]
> = {
  "post-1": [
    {
      id: "r1",
      name: "김연주자",
      lastMessage: "혹시 오디션 일정은 어떻게 되는 걸까요?",
      timestamp: "오전 7시 40분",
      unreadCount: 2,
      isOnline: false,
      isMusic: true,
      isVerified: false,
    },
    {
      id: "r2",
      name: "데이전시",
      lastMessage: "오디션 일정이 확정되었습니다.",
      timestamp: "오후 8시 10분",
      unreadCount: 1,
      isOnline: false,
      isMusic: false,
      isVerified: true,
    },
    {
      id: "r3",
      name: "이연주자",
      lastMessage: "답변 감사합니다.",
      timestamp: "오전 7시 40분",
      unreadCount: 0,
      isOnline: false,
      isMusic: true,
      isVerified: false,
    },
  ],
  "post-2": [
    {
      id: "r4",
      name: "지원자A",
      lastMessage: "지원서 제출했습니다.",
      timestamp: "오전 6시 10분",
      unreadCount: 1,
      isOnline: false,
      isMusic: false,
      isVerified: false,
    },
  ],
};

export default function MyPostedChatRoomsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const { postId, title, typeTag, statusTag, dDay } = route.params;

  const rooms = MOCK_ROOMS_BY_POST_ID[postId] ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.postCard}>
        <View style={styles.postThumb} />
        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.postTagsRow}>
            {typeTag ? (
              <View style={[styles.tagChip, styles.tagChipOrange]}>
                <Text style={[styles.tagText, styles.tagTextOrange]}>{typeTag}</Text>
              </View>
            ) : null}
            {statusTag ? (
              <View style={[styles.tagChip, styles.tagChipGray]}>
                <Text style={[styles.tagText, styles.tagTextGray]}>{statusTag}</Text>
              </View>
            ) : null}
            {dDay ? (
              <View style={[styles.tagChip, styles.tagChipNavy]}>
                <Text style={[styles.tagText, styles.tagTextNavy]}>{dDay}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text style={styles.roomsCountLabel}>채팅방 {rooms.length}</Text>

      <FlatList
        data={rooms}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(RootRoutes.CHAT_ROOM, {
                name: item.name,
                handle: item.id,
                isOnline: item.isOnline,
              })
            }
          >
            <ChatItem
              name={item.name}
              lastMessage={item.lastMessage}
              timestamp={item.timestamp}
              unreadCount={item.unreadCount}
              isOnline={item.isOnline}
              isMusic={item.isMusic}
              isVerified={item.isVerified}
              variant="default"
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

