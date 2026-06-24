import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SelectableTag from "../../../../components/ui/SelectableTag";
import EmptyState, { emptyScreenStyle } from "../../../../components/ui/EmptyState";
import InquiryHistoryItem from "./InquiryHistoryItem";
import { getMyInquiries, mapInquiryToItem } from "../../../../lib/apis/inquiry/inquiryApi";
import { MAIN } from "../../../../color";
import styles from "../styles";

type FilterType = "answered" | "unanswered";

const InquiryHistoryTab = () => {
  const [filter, setFilter] = useState<FilterType>("unanswered");
  const [inquiries, setInquiries] = useState<ReturnType<typeof mapInquiryToItem>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await getMyInquiries();
    setInquiries(rows.map(mapInquiryToItem));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredInquiries = useMemo(() => {
    if (filter === "answered") {
      return inquiries.filter((item) => item.isAnswered);
    }
    return inquiries.filter((item) => !item.isAnswered);
  }, [filter, inquiries]);

  const totalCount = inquiries.length;

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
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

      <View style={styles.historyList}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={MAIN.DEFAULT} />
          </View>
        ) : filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry, index) => (
            <InquiryHistoryItem
              key={inquiry.id}
              inquiry={inquiry}
              isLast={index === filteredInquiries.length - 1}
            />
          ))
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
        )}
      </View>
    </ScrollView>
  );
};

export default InquiryHistoryTab;
