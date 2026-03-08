import React, { useState } from "react";
import { ScrollView } from "react-native";
import ShadowCardList, {
  ShadowCardListToggleItem,
} from "../../components/ShadowCardList/ShadowCardList";
import styles from "./styles";

const NotificationSettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListToggleItem
          label="푸시 알림 중단"
          description="알림이 비활성화됩니다"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <ShadowCardListToggleItem
          label="이메일 알림 중단"
          description="소식 받지 않기"
          value={emailEnabled}
          onValueChange={setEmailEnabled}
          isLast
        />
      </ShadowCardList>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;
