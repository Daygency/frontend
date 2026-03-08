import React, { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RED } from "../../color";
import styles from "./styles";

const WITHDRAW_PRECAUTIONS = [
  "현재 사용 중인 계정의 정보는 탈퇴 후 복구가 불가합니다.",
  "탈퇴 후 회원님의 정보는 전자상거래 소비자보호법에 의거 한 데이전시의 개인정보처리방침에 따라 관리됩니다.",
  "작성했던 게시글 및 댓글/답글은 탈퇴 시 자동 삭제되지 않습니다. 글 삭제를 원하신다면 탈퇴 신청 전에 글을 삭제해 주시기 바랍니다.",
];

const WithdrawConfirmScreen = () => {
  const [precautionsChecked, setPrecautionsChecked] = useState(false);

  const handleDeleteAccount = () => {
    // TODO: 계정 삭제 로직
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>탈퇴하시겠어요?</Text>

        <View style={styles.bulletList}>
          {WITHDRAW_PRECAUTIONS.map((text, index) => (
            <Text key={index} style={styles.bulletItem}>
              - {text}
            </Text>
          ))}
        </View>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setPrecautionsChecked(!precautionsChecked)}
        >
          <MaterialCommunityIcons
            name={
              precautionsChecked ? "checkbox-marked" : "checkbox-blank-outline"
            }
            size={24}
            color={precautionsChecked ? RED.DEFAULT : "#888"}
          />
          <Text style={styles.checkboxLabel}>
            주의사항을 모두 확인하였습니다.
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.deleteButton,
            !precautionsChecked && styles.deleteButtonDisabled,
          ]}
          onPress={precautionsChecked ? handleDeleteAccount : undefined}
          disabled={!precautionsChecked}
        >
          <Text
            style={[
              styles.deleteButtonText,
              !precautionsChecked && styles.deleteButtonTextDisabled,
            ]}
          >
            계정 삭제하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WithdrawConfirmScreen;
