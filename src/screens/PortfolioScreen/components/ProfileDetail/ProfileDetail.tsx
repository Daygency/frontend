import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import ShadowCardButton from "../../../../components/ShadowCardButton/ShadowCardButton";
import { getMyProfile } from "../../../../lib/profileApi";
import { useAuth } from "../../../../contexts/AuthContext";

const ProfileDetail = () => {
  const { user } = useAuth();
  const [profile, setProfile] =
    useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyProfile().then((data) => {
      if (!cancelled) {
        setProfile(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { justifyContent: "center", alignItems: "center", minHeight: 200 },
        ]}
      >
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  const aboutMe = profile?.aboutMe?.trim() || "소개가 없습니다.";
  const email = profile?.contact?.email ?? user?.email ?? "";
  const phoneNumber = profile?.contact?.phoneNumber ?? "";
  const hasContact = email || phoneNumber;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>소개</Text>
        <Text style={styles.sectionContent}>{aboutMe}</Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>학력</Text>
        <Text style={styles.sectionContent}>
          {profile?.education?.trim() || "정보가 없습니다."}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>경력</Text>
        <Text style={styles.sectionContent}>
          {profile?.career?.trim() || "정보가 없습니다."}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>수상 경력</Text>
        <Text style={styles.sectionContent}>
          {profile?.awards?.trim() || "정보가 없습니다."}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>연락처</Text>
        {hasContact ? (
          <>
            {email ? (
              <Text style={styles.sectionContent}>Email: {email}</Text>
            ) : null}
            {phoneNumber ? (
              <Text style={styles.sectionContent}>Phone: {phoneNumber}</Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.sectionContent}>연락처 정보가 없습니다.</Text>
        )}
      </ShadowCardButton>
    </ScrollView>
  );
};

export default ProfileDetail;
