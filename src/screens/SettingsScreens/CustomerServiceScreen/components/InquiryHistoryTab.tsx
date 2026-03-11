import React, { useState, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import SelectableTag from "../../../../components/SelectableTag/SelectableTag";
import ShadowCardList from "../../../../components/ShadowCardList/ShadowCardList";
import InquiryHistoryItem from "./InquiryHistoryItem";
import styles from "../styles";

type FilterType = "answered" | "unanswered";

const MOCK_INQUIRIES = [
  {
    id: "1",
    content: "회원 탈퇴 방법을 알려주세요.",
    date: "2025.03.05",
    isAnswered: true,
    answer: "설정 > 계정에서 탈퇴할 수 있습니다.",
  },
  {
    id: "2",
    content: "프로필 사진 업로드가 되지 않아요. 위 스크린샷처럼 에러가 떠요.",
    date: "2025.03.07",
    isAnswered: false,
    images: [
      "https://m.img24.com/web/product/big/202204/d9756600f4d10e085e427bfc3760492d.jpg",
    ],
  },
  {
    id: "3",
    content: "결제 환불 문의드립니다.",
    date: "2025.03.01",
    isAnswered: true,
    answer: "고객센터로 연락 부탁드립니다.",
  },
  {
    id: "4",
    content: "앱이 자주 튕기는 현상이 있어요.",
    date: "2025.03.08",
    isAnswered: false,
  },
];

const InquiryHistoryTab = () => {
  const [filter, setFilter] = useState<FilterType>("unanswered");

  const filteredInquiries = useMemo(() => {
    return MOCK_INQUIRIES.filter((item) =>
      filter === "answered" ? item.isAnswered : !item.isAnswered
    );
  }, [filter]);

  const totalCount = MOCK_INQUIRIES.length;

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 문의내역 개수 */}
      <Text style={styles.historyCount}>문의내역 {totalCount}건</Text>

      {/* 답변완료 / 미답변 태그 */}
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

      {/* 문의 리스트 */}
      <View style={styles.historyList}>
        {filteredInquiries.length > 0 ? (
          <ShadowCardList>
            {filteredInquiries.map((inquiry, index) => (
              <InquiryHistoryItem
                key={inquiry.id}
                inquiry={inquiry}
                isLast={index === filteredInquiries.length - 1}
              />
            ))}
          </ShadowCardList>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {filter === "answered"
                ? "답변이 완료된 문의가 없습니다."
                : "미답변 문의가 없습니다."}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default InquiryHistoryTab;
