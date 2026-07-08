import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SelectableTag from "../../../../components/ui/SelectableTag";
import EmptyState, { emptyScreenStyle } from "../../../../components/ui/EmptyState";
import InquiryHistoryItem from "./InquiryHistoryItem";
import { getMyInquiries, mapInquiryToItem } from "../../../../lib/apis/inquiry/inquiryApi";
import { MAIN } from "../../../../color";
import styles from "../styles";

type FilterType = "answered" | "unanswered";
type InquiryHistoryItemModel = ReturnType<typeof mapInquiryToItem>;

const PAGE_LIMIT = 20;

const InquiryHistoryTab = () => {
  const [filter, setFilter] = useState<FilterType>("unanswered");
  const [inquiries, setInquiries] = useState<InquiryHistoryItemModel[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getMyInquiries({ limit: PAGE_LIMIT });
    setInquiries(res.items.map(mapInquiryToItem));
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const onEndReached = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore || loading) return;
    setLoadingMore(true);
    const res = await getMyInquiries({ cursor: nextCursor, limit: PAGE_LIMIT });
    setInquiries((prev) => [...prev, ...res.items.map(mapInquiryToItem)]);
    setNextCursor(res.nextCursor);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [hasMore, nextCursor, loadingMore, loading]);

  const filteredInquiries = useMemo(() => {
    if (filter === "answered") {
      return inquiries.filter((item) => item.isAnswered);
    }
    return inquiries.filter((item) => !item.isAnswered);
  }, [filter, inquiries]);

  const totalCount = inquiries.length;

  return (
    <FlatList
      style={styles.tabContent}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      data={filteredInquiries}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
      onEndReached={() => void onEndReached()}
      onEndReachedThreshold={0.35}
      ListHeaderComponent={
        <>
          <Text style={styles.historyCount}>문의내역 {totalCount}건</Text>
          <View style={styles.filterTags}>
            <SelectableTag
              label="답변완료"
              selected={filter === "answered"}
              onPress={() => setFilter("answered")}
            />
            <SelectableTag
              label="미답변"
              selected={filter === "unanswered"}
              onPress={() => setFilter("unanswered")}
            />
          </View>
          <View style={styles.historyList} />
        </>
      }
      renderItem={({ item, index }) => (
        <InquiryHistoryItem
          inquiry={item}
          isLast={index === filteredInquiries.length - 1}
        />
      )}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : null
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : (
          <View style={[styles.emptyState, emptyScreenStyle, { minHeight: 320 }]}>
            <EmptyState
              message={
                filter === "answered"
                  ? "답변 완료된 문의가 없습니다."
                  : "미답변 문의가 없습니다."
              }
            />
          </View>
        )
      }
    />
  );
};

export default InquiryHistoryTab;
