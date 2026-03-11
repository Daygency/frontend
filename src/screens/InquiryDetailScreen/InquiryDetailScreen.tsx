import React from "react";
import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import ShadowCardList from "../../components/ShadowCardList/ShadowCardList";
import { GRAY } from "../../color";
import type { InquiryItem } from "../SettingsScreens/CustomerServiceScreen/components/InquiryHistoryItem";

export type InquiryDetailParams = {
  inquiry: InquiryItem;
};

type RootStackParamList = {
  InquiryDetail: InquiryDetailParams;
};

const InquiryDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "InquiryDetail">>();
  const { inquiry } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 내가 올린 글 */}
      <Text style={styles.sectionTitle}>내가 올린 글</Text>
      <ShadowCardList>
        <View style={styles.sectionContent}>
          <Text style={styles.date}>{inquiry.date}</Text>
          <Text style={styles.content}>{inquiry.content}</Text>
          {inquiry.images && inquiry.images.length > 0 && (
            <View style={styles.imageList}>
              {inquiry.images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.attachedImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>
      </ShadowCardList>

      {/* 답변 내역 */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>
        답변 내역
      </Text>
      <ShadowCardList>
        <View style={styles.sectionContent}>
          {inquiry.isAnswered && inquiry.answer ? (
            <Text style={styles.answer}>{inquiry.answer}</Text>
          ) : (
            <Text style={styles.waiting}>답변 대기 중입니다.</Text>
          )}
        </View>
      </ShadowCardList>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#575757",
    marginBottom: 12,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  sectionContent: {
    padding: 20,
  },
  date: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#575757",
    lineHeight: 22,
  },
  imageList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  attachedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  answer: {
    fontSize: 14,
    color: "#575757",
    lineHeight: 22,
  },
  waiting: {
    fontSize: 14,
    color: GRAY.DARK_2,
  },
});

export default InquiryDetailScreen;
