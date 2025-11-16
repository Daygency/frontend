import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader from "../components/MainHomeHeader/MainHomeHeader";
import Logo from "../components/Logo/Logo";
import CategoryNavBar from "../components/CategoryNavBar/CategoryNavBar";
import ImageScrollView from "../components/ImageScrollView/ImageScrollView";
import Section from "../components/Section/Section";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, MAIN, WHITE } from "../color";
import SupplierList from "../components/SupplierList/SupplierList";
import ShadowCardButton from "../components/ShadowCardButton/ShadowCardButton";
import AnnouncementCard from "../components/AnnouncementCard/AnnouncementCard";
import GrayCard from "../components/GrayCard/GrayCard";

const MainHomeScreen = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <View style={styles.title_header}>
        <Logo size={24} />
        <Pressable style={styles.portfolioButton}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="account" size={18} color={WHITE} />
          </View>
          <Text style={styles.portfolioTitle}>{"내 포트폴리오"}</Text>
        </Pressable>
      </View>
      <MainHomeHeader />
      <CategoryNavBar />
      <ScrollView>
        <ImageScrollView
          styles={{ container: { marginBottom: 14 } }}
          width={339}
          height={183}
          gap={5}
        />
        <SupplierList />
        <Section title="모집공고" onPressMore={() => {}}>
          <AnnouncementCard title="제목1" />
          <AnnouncementCard title="제목2" />
          <AnnouncementCard title="제목3" />
        </Section>
        <Section
          title="공연소식"
          styles={{ content: { paddingHorizontal: 0 } }}
        >
          <ImageScrollView
            styles={{ container: { marginBottom: 14 } }}
            width={138}
            height={193}
            gap={14}
          />
        </Section>
        <Section title="커뮤니티" onPressMore={() => {}}>
          <GrayCard
            items={[
              {
                boardName: "자유게시판",
                latestPost: "공연 무사히 마무리했습니다!",
                hasNew: true,
              },
              {
                boardName: "강사·대타구인",
                latestPost: "00월 00일 스탭 구합니다.",
              },
              { boardName: "입시 정보", latestPost: "입시 정보 공유해주세요!" },
              { boardName: "유학 정보", latestPost: "유학 질문 드립니다." },
              {
                boardName: "학원 운영",
                latestPost: "학원을 운영하려고 하는데 도움이 필요합니다!",
              },
              {
                boardName: "학원·연습실 매매",
                latestPost: "연습실 내놓습니다.",
              },
            ]}
          />
        </Section>
        <Section title="내 공연 일정" onPressMore={() => {}}>
          <ShadowCardButton>
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>재즈 페스티벌 2025</Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>D-12</Text>
              </View>
            </View>
          </ShadowCardButton>
          <ShadowCardButton>
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>재즈 페스티벌 2025</Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>D-12</Text>
              </View>
            </View>
          </ShadowCardButton>
          <ShadowCardButton>
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>재즈 페스티벌 2025</Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>D-12</Text>
              </View>
            </View>
          </ShadowCardButton>
        </Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: WHITE,
  },
  title_header: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12 + 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  portfolioButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 40,
    backgroundColor: MAIN.DEFAULT,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portfolioTitle: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
    marginLeft: 22,
    lineHeight: 17,
  },
  icon: {
    position: "absolute",
    left: 8,
    // height: "100%",
    justifyContent: "center",
  },
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "400",
  },
  dateBadge: {
    backgroundColor: BLACK,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MainHomeScreen;
