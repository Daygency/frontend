import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SelectableTag from "../../../../components/SelectableTag/SelectableTag";
import styles from "../styles";

type FilterType = "answered" | "unanswered";

const InquiryHistoryTab = () => {
  const [filter, setFilter] = useState<FilterType>("unanswered");
  const filteredInquiries = useMemo(() => [], [filter]);
  const totalCount = 0;

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
        {filteredInquiries.length > 0 ? null : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              문의 내역 기능은 준비 중입니다.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default InquiryHistoryTab;
