import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ArtistCard from "../../../components/cards/ArtistCard";
import EmptyState, { contentContainerWhenEmpty } from "../../../components/ui/EmptyState";
import MajorTagFilter from "../../../components/modals/MajorTagFilter";
import MajorTagSelectModal from "../../../components/modals/MajorTagSelectModal";
import styles from "./artistStyles";
import { RootRoutes } from "../../../navigations/routes";
import { getMajors, type Major } from "../../../lib/apis/announcement/majorApi";
import { getUsers } from "../../../lib/apis/users/usersApi";
import type { UserListItem } from "../../../lib/apis/users/types";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import { MAIN } from "../../../color";

const MAJOR_OPTIONS = [
  "건반악기",
  "현악",
  "관악",
  "성악",
  "타악",
  "작곡",
  "지휘",
  "음악학",
  "국악",
  "무용",
  "실용",
  "뮤지컬·크로스오버",
  "기타",
];

const ArtistScene = () => {
  const navigation = useNavigation<any>();
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [majors, setMajors] = useState<Major[]>([]);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const majorOptions = useMemo(
    () => (majors.length > 0 ? majors.map((m) => m.name) : MAJOR_OPTIONS),
    [majors],
  );

  const majorIdsQuery = useMemo(() => {
    if (!selectedMajors.length || !majors.length) return undefined;
    const ids = majors
      .filter((m) => selectedMajors.includes(m.name))
      .map((m) => m.majorId);
    return ids.length ? ids.join(",") : undefined;
  }, [selectedMajors, majors]);

  useEffect(() => {
    getMajors().then((list) => {
      if (list.length) setMajors(list);
    });
  }, []);

  const reloadUsers = useCallback(
    async (opts?: { skipLoadingSpinner?: boolean }) => {
      if (!opts?.skipLoadingSpinner) setLoading(true);
      const res = await getUsers({
        limit: 8,
        ...(majorIdsQuery ? { majorIds: majorIdsQuery } : {}),
      });
      if (!opts?.skipLoadingSpinner) setLoading(false);
      if (!res) {
        setUsers([]);
        setCursor(null);
        setHasMore(false);
        return;
      }
      setUsers(res.items);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    },
    [majorIdsQuery],
  );

  useEffect(() => {
    void reloadUsers();
  }, [reloadUsers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadUsers({ skipLoadingSpinner: true });
    setRefreshing(false);
  };

  const onEndReached = useCallback(async () => {
    if (!hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getUsers({
      limit: 8,
      cursor,
      ...(majorIdsQuery ? { majorIds: majorIdsQuery } : {}),
    });
    setLoadingMore(false);
    if (!res) return;
    setUsers((prev) => [...prev, ...res.items]);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [hasMore, cursor, loadingMore, loading, majorIdsQuery]);

  const isEmpty = users.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          <MajorTagFilter
            selectedValues={selectedMajors}
            onPress={() => setIsMajorModalVisible(true)}
          />
        </View>
      </View>

      <MajorTagSelectModal
        visible={isMajorModalVisible}
        options={majorOptions}
        selectedValues={selectedMajors}
        onToggle={(value) => {
          setSelectedMajors((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value],
          );
        }}
        onComplete={() => setIsMajorModalVisible(false)}
      />

      <FlatList
        style={{ flex: 1 }}
        data={users}
        keyExtractor={(item) => item.userId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator color={MAIN.DEFAULT} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            loading && !refreshing ? (
              <View style={{ paddingVertical: 48, alignItems: "center" }}>
                <ActivityIndicator size="small" color={MAIN.DEFAULT} />
              </View>
            ) : (
              <EmptyState message="유저가 없습니다." />
            )
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ArtistCard
                name={item.name || "이름 없음"}
                category={item.major?.name ?? "전공 미설정"}
                avatarUrl={resolveProfileImageUrlForDisplay(item.profileImgUrl)}
                activityName={item.activityName}
                musicNoteCount={0}
                onPress={() =>
                  navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
                    activityName: item.activityName,
                    userId: item.userId,
                  })
                }
              />
            </View>
          )}
          contentContainerStyle={contentContainerWhenEmpty(
            isEmpty,
            styles.scrollContent,
          )}
        />
    </View>
  );
};

export default ArtistScene;
