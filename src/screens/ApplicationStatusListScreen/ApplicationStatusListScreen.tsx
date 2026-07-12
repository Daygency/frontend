import { FlatList, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import { RootRoutes } from "../../navigations/routes";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { announcementListRecruitmentStatus } from "../../lib/announcement/announcementListStatus";
import { resolveAnnouncementAuthorLabel } from "../../lib/announcement/announcementAuthor";
import styles from "./styles";

export type ApplicationStatusListParams = {
  label: string;
  items: AnnouncementListItem[];
};

type RootStackParamList = {
  ApplicationStatusList: ApplicationStatusListParams;
  AnnouncementDetail: {
    postId?: string;
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    postedDate?: string;
    viewCount?: number;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ApplicationStatusListRouteProp = RouteProp<
  RootStackParamList,
  "ApplicationStatusList"
>;

const ApplicationStatusListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ApplicationStatusListRouteProp>();
  const items = route.params?.items ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={contentContainerWhenEmpty(
          items.length === 0,
          styles.listContent,
        )}
        renderItem={({ item }) => {
          const status = announcementListRecruitmentStatus(item);
          const daysLeft = parseAnnouncementDaysLeft(item.dDay);
          return (
            <View style={styles.cardWrapper}>
              <AnnouncementCard
                title={item.title}
                type={item.type}
                status={status}
                daysLeft={daysLeft}
                deadlineAt={item.deadlineAt}
                completed={item.completed}
                viewCount={item.viewCount}
                priceType={item.priceType}
                price={item.price}
                address={item.address}
                authorName={resolveAnnouncementAuthorLabel(item.user)}
                profileImgUrl={item.user?.profileImgUrl}
                onPress={() =>
                  navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                    postId: item.postId,
                    title: item.title,
                    type: item.type,
                    status,
                    daysLeft,
                    postedDate: item.createdAt,
                    viewCount: item.viewCount,
                  })
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState message="해당 상태의 지원 내역이 없습니다." />
        }
      />
    </View>
  );
};

export default ApplicationStatusListScreen;
