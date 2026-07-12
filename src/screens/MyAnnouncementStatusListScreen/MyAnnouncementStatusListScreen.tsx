import { useState } from "react";
import { FlatList, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AnnouncementMyPostRow from "../AnnouncementScreen/components/AnnouncementMyPostRow";
import EmptyState, { contentContainerWhenEmpty } from "../../components/ui/EmptyState";
import MainHomeHeader from "../../components/layout/MainHomeHeader";
import { RootRoutes } from "../../navigations/routes";
import type { AnnouncementListItem } from "../../lib/apis/announcement/types";
import type { AnnouncementApplicantSummary } from "../../lib/application/announcementApplicantSummary";
import { announcementListRecruitmentStatus } from "../../lib/announcement/announcementListStatus";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import styles from "./styles";

export const MY_ANNOUNCEMENT_STATUS_TABS = ["모집중", "모집완료", "공연완료"] as const;
export type MyAnnouncementStatusTab = (typeof MY_ANNOUNCEMENT_STATUS_TABS)[number];

export type MyAnnouncementStatusListParams = {
  initialTab: MyAnnouncementStatusTab;
  groups: Record<MyAnnouncementStatusTab, AnnouncementListItem[]>;
  applicantSummaries?: Record<string, AnnouncementApplicantSummary | null>;
};

type RootStackParamList = {
  MyAnnouncementStatusList: MyAnnouncementStatusListParams;
  AnnouncementApplicants: { postId: string; title: string };
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
type MyAnnouncementStatusListRouteProp = RouteProp<
  RootStackParamList,
  "MyAnnouncementStatusList"
>;

const MyAnnouncementStatusListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MyAnnouncementStatusListRouteProp>();
  const groups = route.params?.groups;
  const applicantSummaries = route.params?.applicantSummaries ?? {};
  const [activeTab, setActiveTab] = useState<MyAnnouncementStatusTab>(
    route.params?.initialTab ?? "모집중",
  );
  const items = groups?.[activeTab] ?? [];

  const tabOptions = MY_ANNOUNCEMENT_STATUS_TABS.map((tab) => ({
    tab,
    label: `${tab} (${groups?.[tab]?.length ?? 0})`,
  }));

  return (
    <View style={styles.container}>
      <MainHomeHeader
        tabs={tabOptions.map((option) => option.label)}
        activeTab={tabOptions.find((option) => option.tab === activeTab)?.label ?? ""}
        onTabChange={(label) => {
          const found = tabOptions.find((option) => option.label === label);
          if (found) setActiveTab(found.tab);
        }}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={contentContainerWhenEmpty(
          items.length === 0,
          styles.listContent,
        )}
        renderItem={({ item }) => {
          const status = announcementListRecruitmentStatus(item);
          return (
            <View style={styles.cardWrapper}>
              <AnnouncementMyPostRow
                title={item.title}
                status={status}
                type={item.type}
                createdAt={item.createdAt}
                completed={item.completed}
                summary={applicantSummaries[item.postId] ?? null}
                onPress={() =>
                  navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
                    postId: item.postId,
                    title: item.title,
                    type: item.type,
                    status,
                    daysLeft: parseAnnouncementDaysLeft(item.dDay),
                    postedDate: item.createdAt,
                    viewCount: item.viewCount,
                  })
                }
                onPressApplicants={() =>
                  navigation.navigate(RootRoutes.ANNOUNCEMENT_APPLICANTS, {
                    postId: item.postId,
                    title: item.title,
                  })
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message="해당 상태의 공고가 없습니다." />}
      />
    </View>
  );
};

export default MyAnnouncementStatusListScreen;
