import React from "react";
import { ScrollView } from "react-native";
import ShadowCardList, { ShadowCardListItem } from "../../../components/ShadowCardList/ShadowCardList";
import { GRAY } from "../../../color";
import styles from "./styles";

const ORIGINAL_NAME = "김연주";
/** 이름·이메일은 수정 불가 — 연한 회색으로 표시 */
const READONLY_VALUE_COLOR = GRAY.MEDIUM_100;

const MyInfoScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListItem
          label="이름"
          value={ORIGINAL_NAME}
          valueColor={READONLY_VALUE_COLOR}
        />
        <ShadowCardListItem label="연락처" value="010-1234-5678" />
        <ShadowCardListItem
          label="이메일"
          value="dami**@naver.com"
          valueColor={READONLY_VALUE_COLOR}
          isLast
        />
      </ShadowCardList>
    </ScrollView>
  );
};

export default MyInfoScreen;
