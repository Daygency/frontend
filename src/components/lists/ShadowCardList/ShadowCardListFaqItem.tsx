import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { GRAY } from "../../../color";

export interface ShadowCardListFaqItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

const ShadowCardListFaqItem = ({
  question,
  answer,
  isLast,
}: ShadowCardListFaqItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setIsExpanded(!isExpanded)}
      style={[styles.faqItem, isLast && styles.itemLast]}
    >
      <View style={styles.faqItemHeader}>
        <Text style={styles.faqQuestion} numberOfLines={isExpanded ? undefined : 1}>
          {question}
        </Text>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={GRAY.DARK_1}
        />
      </View>
      {isExpanded && (
        <View style={styles.faqAnswerWrap}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default ShadowCardListFaqItem;
