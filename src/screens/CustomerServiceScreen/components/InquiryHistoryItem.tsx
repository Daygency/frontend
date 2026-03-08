import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import { RootRoutes } from "../../../navigations/routes";
import styles from "../inquiryHistoryItemStyles";

export interface InquiryItem {
  id: string;
  content: string;
  date: string;
  isAnswered: boolean;
  answer?: string;
  images?: string[];
}

interface InquiryHistoryItemProps {
  inquiry: InquiryItem;
  isLast?: boolean;
}

const InquiryHistoryItem = ({ inquiry, isLast }: InquiryHistoryItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <Pressable
      style={[styles.item, isLast && styles.itemLast]}
      onPress={() => {
        navigation.navigate(RootRoutes.INQUIRY_DETAIL, { inquiry });
      }}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.statusTag,
              inquiry.isAnswered ? styles.statusAnswered : styles.statusUnanswered,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                inquiry.isAnswered ? styles.statusTextAnswered : styles.statusTextUnanswered,
              ]}
            >
              {inquiry.isAnswered ? "답변완료" : "미답변"}
            </Text>
          </View>
          <Text style={styles.date}>{inquiry.date}</Text>
        </View>
        <Text style={styles.content} numberOfLines={2}>
          {inquiry.content}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={GRAY.DARK_1}
      />
    </Pressable>
  );
};

export default InquiryHistoryItem;
