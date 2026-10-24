import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EmptyState from "../../components/ui/EmptyState";
import { MAIN } from "../../color";
import { RootRoutes } from "../../navigations/routes";
import {
  getMySchedule,
  type MyScheduleItem,
} from "../../lib/apis/announcement/announcementApi";
import {
  MY_SCHEDULE_KIND_LABEL,
  formatScheduleTime,
  groupScheduleByDay,
  isDeadlineKind,
} from "../../lib/announcement/mySchedule";
import { placeholderAnnouncement } from "../../lib/notifications/navigateFromInboxItem";
import styles from "./styles";

const MyScheduleScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [items, setItems] = useState<MyScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    const res = await getMySchedule();
    setLoadError(res === null);
    setItems(res ?? []);
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const sections = useMemo(() => groupScheduleByDay(items), [items]);

  const openDetail = (item: MyScheduleItem) => {
    navigation.navigate(RootRoutes.ANNOUNCEMENT_DETAIL, {
      postId: item.postId,
      ...placeholderAnnouncement,
      title: item.title,
      type: item.type,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={sections.length === 0 ? styles.emptyContent : styles.content}
      sections={sections}
      keyExtractor={(item) => `${item.kind}:${item.postId}`}
      stickySectionHeadersEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={MAIN.DEFAULT}
          colors={[MAIN.DEFAULT]}
        />
      }
      ListEmptyComponent={
        <EmptyState
          message={
            loadError
              ? "일정을 불러오지 못했어요.\n당겨서 다시 시도해 주세요."
              : "다가오는 일정이 없어요.\n합격한 공고, 내가 올린 공고, 저장한 공고의 일정이 여기에 모여요."
          }
        />
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.dayLabel}>{section.dayLabel}</Text>
          <Text style={styles.relative}>{section.relative}</Text>
        </View>
      )}
      renderItem={({ item }) => {
        const deadline = isDeadlineKind(item.kind);
        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => openDetail(item)}
          >
            <Text style={styles.time}>{formatScheduleTime(item.date)}</Text>
            <View style={styles.rowBody}>
              <Text
                style={[styles.kind, deadline ? styles.kindDeadline : styles.kindScheduled]}
              >
                {MY_SCHEDULE_KIND_LABEL[item.kind]}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              {item.address ? (
                <Text style={styles.meta} numberOfLines={1}>
                  {item.type ? `${item.type} · ` : ""}
                  {item.address}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export default MyScheduleScreen;
