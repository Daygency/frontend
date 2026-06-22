import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ShadowCardList, {
  ShadowCardListItem,
} from "../../../components/lists/ShadowCardList";
import { GRAY } from "../../../color";
import { getMyProfile } from "../../../lib/apis/portfolio/profileApi";
import { getProfileCache } from "../../../lib/profileCache";
import styles from "./styles";

/** 이름·이메일은 수정 불가 — 연한 회색으로 표시 */
const READONLY_VALUE_COLOR = GRAY.MEDIUM_100;

function maskEmail(email: string | undefined): string {
  const trimmed = email?.trim() ?? "";
  if (!trimmed || trimmed.includes("@social.placeholder")) {
    return "미등록";
  }
  const at = trimmed.indexOf("@");
  if (at <= 0) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!domain) return trimmed;
  if (local.length <= 2) {
    return `${local[0] ?? ""}*@${domain}`;
  }
  const visible = local.slice(0, Math.min(4, local.length - 1));
  return `${visible}**@${domain}`;
}

function formatPhoneNumber(phone: string | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits || /^0+$/.test(digits)) {
    return "미등록";
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone?.trim() || "미등록";
}

type MyInfoState = {
  name: string;
  phone: string;
  email: string;
};

const MyInfoScreen = () => {
  const [info, setInfo] = useState<MyInfoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyProfile = useCallback(
    (profile: Awaited<ReturnType<typeof getMyProfile>>) => {
      if (!profile) return;
      setInfo({
        name: profile.name?.trim() || "미등록",
        phone: formatPhoneNumber(profile.contact?.phoneNumber),
        email: maskEmail(profile.contact?.email),
      });
    },
    [],
  );

  const loadInfo = useCallback(async () => {
    setError(null);
    setLoading(true);

    const cached = await getProfileCache();
    if (cached) {
      applyProfile(cached);
      setLoading(false);
    }

    const profile = await getMyProfile();
    if (profile) {
      applyProfile(profile);
      setError(null);
    } else if (!cached) {
      setError("내 정보를 불러오지 못했습니다.");
    }
    setLoading(false);
  }, [applyProfile]);

  useFocusEffect(
    useCallback(() => {
      void loadInfo();
    }, [loadInfo]),
  );

  if (loading && !info) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="small" color="#1F2A44" />
      </View>
    );
  }

  if (error && !info) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListItem
          label="이름"
          value={info?.name ?? "미등록"}
          valueColor={READONLY_VALUE_COLOR}
        />
        <ShadowCardListItem
          label="연락처"
          value={info?.phone ?? "미등록"}
        />
        <ShadowCardListItem
          label="이메일"
          value={info?.email ?? "미등록"}
          valueColor={READONLY_VALUE_COLOR}
          isLast
        />
      </ShadowCardList>
    </ScrollView>
  );
};

export default MyInfoScreen;
