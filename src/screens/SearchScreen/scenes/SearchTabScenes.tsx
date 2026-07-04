import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AnnouncementCard from "../../../components/cards/AnnouncementCard";
import ArtistCard from "../../../components/cards/ArtistCard";
import EventNewsCard from "../../../components/cards/EventNewsCard";
import CommunityCard from "../../LoungeScreen/components/CommunityCard";
import EmptyState, {
  contentContainerWhenEmpty,
  emptyScreenStyle,
} from "../../../components/ui/EmptyState";
import {
  pickCommunityAuthor,
  pickCommunityAuthorUserId,
  pickCommunityProfileImgUrl,
} from "../../../lib/community/communityAuthor";
import { formatPerformanceListDateLabel } from "../../../lib/news/formatPerformanceOpenLabel";
import { ContentRoutes, RootRoutes } from "../../../navigations/routes";
import { getAnnouncementList } from "../../../lib/apis/announcement/announcementApi";
import type { AnnouncementListItem } from "../../../lib/apis/announcement/types";
import { parseAnnouncementDaysLeft } from "../../../lib/announcement/parseAnnouncementDaysLeft";
import { announcementListRecruitmentStatus } from "../../../lib/announcement/announcementListStatus";
import { resolveAnnouncementAuthorLabel } from "../../../lib/announcement/announcementAuthor";
import { getNewsList } from "../../../lib/apis/news/newsApi";
import type { NewsListItem } from "../../../lib/apis/news/types";
import { getCommunityList } from "../../../lib/apis/community/communityApi";
import type { CommunityListItem } from "../../../lib/apis/community/types";
import { getUsers } from "../../../lib/apis/users/usersApi";
import type { UserListItem } from "../../../lib/apis/users/types";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import {
  pickCommunityListThumbnailUrl,
  pickNewsListThumbnailUrl,
} from "../../../lib/media/listThumbnailUrl";
import { MAIN } from "../../../color";
import styles from "../sceneStyles";
import { useAuth } from "../../../contexts/AuthContext";

type SceneProps = {
  query: string;
};

function formatNewsListDate(
  startedAt?: string,
  endedAt?: string | null,
): string {
  return formatPerformanceListDateLabel(startedAt, endedAt);
}

function formatCommunityDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function navigateToCommunityAuthorProfile(
  navigation: any,
  myUserId: string,
  authorUserId?: string,
  activityName?: string,
) {
  const uid = authorUserId?.trim();
  if (!uid) return;

  if (myUserId && uid.toLowerCase() === myUserId.toLowerCase()) {
    navigation.navigate(RootRoutes.CONTENT_TAB, {
      screen: ContentRoutes.LOUNGE,
    });
    return;
  }

  navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
    userId: uid,
    activityName: activityName?.trim() ?? "",
  });
}

export function SearchAnnouncementScene({ query }: SceneProps) {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<AnnouncementListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirst = useCallback(async () => {
    setLoading(true);
    const res = await getAnnouncementList({
      limit: 20,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoading(false);
    if (!res) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      return;
    }
    setItems(res.items);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [query]);

  useEffect(() => {
    void loadFirst();
  }, [loadFirst]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFirst();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getAnnouncementList({
      limit: 20,
      cursor,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoadingMore(false);
    if (!res) return;
    setItems((prev) => [...prev, ...res.items]);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.postId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={() => void onEndReached()}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <EmptyState
          message={
            query.trim()
              ? `"${query.trim()}"에 맞는 모집공고가 없습니다.`
              : "모집공고가 없습니다."
          }
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : null
      }
      contentContainerStyle={contentContainerWhenEmpty(
        items.length === 0,
        styles.listContent,
      )}
      renderItem={({ item }) => (
        <View style={styles.cardPad}>
          <AnnouncementCard
            title={item.title}
            type={item.type}
            status={announcementListRecruitmentStatus(item)}
            daysLeft={parseAnnouncementDaysLeft(item.dDay)}
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
                title: item.title,
                type: item.type,
                status: announcementListRecruitmentStatus(item),
                daysLeft: parseAnnouncementDaysLeft(item.dDay),
                postId: item.postId,
                viewCount: item.viewCount,
              })
            }
          />
        </View>
      )}
    />
  );
}

export function SearchNewsScene({ query }: SceneProps) {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirst = useCallback(async () => {
    setLoading(true);
    const res = await getNewsList({
      limit: 20,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoading(false);
    if (!res) {
      setItems([]);
      setCursor(null);
      setHasMore(false);
      return;
    }
    setItems(res.items);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [query]);

  useEffect(() => {
    void loadFirst();
  }, [loadFirst]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFirst();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getNewsList({
      limit: 20,
      cursor,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoadingMore(false);
    if (!res) return;
    setItems((prev) => [...prev, ...res.items]);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={items}
      numColumns={2}
      columnWrapperStyle={styles.newsRow}
      keyExtractor={(item) => item.newsId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={() => void onEndReached()}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <EmptyState
          message={
            query.trim()
              ? `"${query.trim()}"에 맞는 공연소식이 없습니다.`
              : "공연소식이 없습니다."
          }
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : null
      }
      contentContainerStyle={contentContainerWhenEmpty(
        items.length === 0,
        styles.newsListContent,
      )}
      renderItem={({ item }) => (
        <View style={styles.newsCardWrap}>
          <EventNewsCard
            width={160}
            height={220}
            title={item.title}
            place={item.place}
            dateRange={formatNewsListDate(item.startedAt, item.endedAt)}
            imageUrl={pickNewsListThumbnailUrl(item) ?? undefined}
            onPress={() =>
              navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
                newsId: item.newsId,
              })
            }
          />
        </View>
      )}
    />
  );
}

export function SearchCommunityScene({ query }: SceneProps) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";
  const [items, setItems] = useState<CommunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getCommunityList({
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoading(false);
    setItems(res ?? []);
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.communityId}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
      ListEmptyComponent={
        <EmptyState
          message={
            query.trim()
              ? `"${query.trim()}"에 맞는 커뮤니티 글이 없습니다.`
              : "커뮤니티 글이 없습니다."
          }
        />
      }
      contentContainerStyle={contentContainerWhenEmpty(
        items.length === 0,
        styles.listContent,
      )}
      renderItem={({ item }) => {
        const author = pickCommunityAuthor(item);
        const authorUserId = pickCommunityAuthorUserId(item);

        return (
          <View style={styles.cardPad}>
            <CommunityCard
              title={item.title}
              contentPreview={item.content}
              author={author}
              profileImageUrl={pickCommunityProfileImgUrl(item)}
              date={formatCommunityDate(item.createdAt)}
              likes={item.likeCount ?? 0}
              comments={item.commentCount ?? 0}
              thumbnailUrl={pickCommunityListThumbnailUrl(item)}
              onPress={() =>
                navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
                  communityId: item.communityId,
                })
              }
              onPressAuthor={
                authorUserId
                  ? () =>
                      navigateToCommunityAuthorProfile(
                        navigation,
                        myUserId,
                        authorUserId,
                        author,
                      )
                  : undefined
              }
            />
          </View>
        );
      }}
    />
  );
}

export function SearchArtistScene({ query }: SceneProps) {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirst = useCallback(async () => {
    setLoading(true);
    const res = await getUsers({
      limit: 20,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoading(false);
    if (!res) {
      setUsers([]);
      setCursor(null);
      setHasMore(false);
      return;
    }
    setUsers(res.items);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  }, [query]);

  useEffect(() => {
    void loadFirst();
  }, [loadFirst]);

  const onEndReached = async () => {
    if (!hasMore || !cursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getUsers({
      limit: 20,
      cursor,
      ...(query.trim() ? { q: query.trim() } : {}),
    });
    setLoadingMore(false);
    if (!res) return;
    setUsers((prev) => [...prev, ...res.items]);
    setCursor(res.nextCursor);
    setHasMore(res.hasMore);
  };

  if (loading && users.length === 0) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={users}
      keyExtractor={(item) => item.userId}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadFirst();
            setRefreshing(false);
          }}
        />
      }
      onEndReached={() => void onEndReached()}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <EmptyState
          message={
            query.trim()
              ? `"${query.trim()}"에 맞는 아티스트가 없습니다.`
              : "아티스트가 없습니다."
          }
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : null
      }
      contentContainerStyle={contentContainerWhenEmpty(
        users.length === 0,
        styles.listContent,
      )}
      renderItem={({ item }) => (
        <View style={styles.cardPad}>
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
    />
  );
}

const ALL_PREVIEW_LIMIT = 3;

export function SearchAllScene({ query }: SceneProps) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [community, setCommunity] = useState<CommunityListItem[]>([]);
  const [artists, setArtists] = useState<UserListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const q = query.trim() || undefined;
      const [ann, newsRes, comm, usersRes] = await Promise.all([
        getAnnouncementList({ limit: ALL_PREVIEW_LIMIT, q }),
        getNewsList({ limit: ALL_PREVIEW_LIMIT, q }),
        getCommunityList({ q }),
        getUsers({ limit: ALL_PREVIEW_LIMIT, q }),
      ]);
      if (cancelled) return;
      setAnnouncements(ann?.items ?? []);
      setNews(newsRes?.items ?? []);
      setCommunity((comm ?? []).slice(0, ALL_PREVIEW_LIMIT));
      setArtists(usersRes?.items ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  const hasAny =
    announcements.length > 0 ||
    news.length > 0 ||
    community.length > 0 ||
    artists.length > 0;

  if (!hasAny) {
    return (
      <View style={emptyScreenStyle}>
        <EmptyState
          message={
            query.trim()
              ? `"${query.trim()}"에 맞는 결과가 없습니다.`
              : "검색어를 입력해 주세요."
          }
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.allContent}>
      {announcements.length > 0 ? (
        <View style={styles.allSection}>
          <Text style={styles.allSectionTitle}>모집공고</Text>
          {announcements.map((item) => (
            <View key={item.postId} style={styles.cardPad}>
              <AnnouncementCard
                title={item.title}
                type={item.type}
                status={announcementListRecruitmentStatus(item)}
                daysLeft={parseAnnouncementDaysLeft(item.dDay)}
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
                    title: item.title,
                    type: item.type,
                    status: announcementListRecruitmentStatus(item),
                    daysLeft: parseAnnouncementDaysLeft(item.dDay),
                    postId: item.postId,
                    viewCount: item.viewCount,
                  })
                }
              />
            </View>
          ))}
        </View>
      ) : null}

      {news.length > 0 ? (
        <View style={styles.allSection}>
          <Text style={styles.allSectionTitle}>공연소식</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.allNewsRow}>
              {news.map((item) => (
                <EventNewsCard
                  key={item.newsId}
                  width={138}
                  height={193}
                  title={item.title}
                  place={item.place}
                  dateRange={formatNewsListDate(item.startedAt, item.endedAt)}
                  imageUrl={pickNewsListThumbnailUrl(item) ?? undefined}
                  onPress={() =>
                    navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
                      newsId: item.newsId,
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : null}

      {community.length > 0 ? (
        <View style={styles.allSection}>
          <Text style={styles.allSectionTitle}>커뮤니티</Text>
          {community.map((item) => {
            const author = pickCommunityAuthor(item);
            const authorUserId = pickCommunityAuthorUserId(item);

            return (
              <View key={item.communityId} style={styles.cardPad}>
                <CommunityCard
                  title={item.title}
                  contentPreview={item.content}
                  author={author}
                  profileImageUrl={pickCommunityProfileImgUrl(item)}
                  date={formatCommunityDate(item.createdAt)}
                  likes={item.likeCount ?? 0}
                  comments={item.commentCount ?? 0}
                  thumbnailUrl={pickCommunityListThumbnailUrl(item)}
                  onPress={() =>
                    navigation.navigate(RootRoutes.COMMUNITY_DETAIL, {
                      communityId: item.communityId,
                    })
                  }
                  onPressAuthor={
                    authorUserId
                      ? () =>
                          navigateToCommunityAuthorProfile(
                            navigation,
                            myUserId,
                            authorUserId,
                            author,
                          )
                      : undefined
                  }
                />
              </View>
            );
          })}
        </View>
      ) : null}

      {artists.length > 0 ? (
        <View style={styles.allSection}>
          <Text style={styles.allSectionTitle}>아티스트</Text>
          {artists.map((item) => (
            <View key={item.userId} style={styles.cardPad}>
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
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

export function renderSearchScene(key: string, query: string) {
  switch (key) {
    case "전체":
      return <SearchAllScene query={query} />;
    case "모집공고":
      return <SearchAnnouncementScene query={query} />;
    case "공연소식":
      return <SearchNewsScene query={query} />;
    case "커뮤니티":
      return <SearchCommunityScene query={query} />;
    case "아티스트":
      return <SearchArtistScene query={query} />;
    default:
      return null;
  }
}
