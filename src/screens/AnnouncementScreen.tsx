import { ScrollView, StyleSheet, View } from "react-native";
import { WHITE } from "../color";
import AnnouncementCard from "../components/AnnouncementCard/AnnouncementCard";

const AnnouncementScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="교향악단 바이올린 객원단원 채용" type="오디션(연주자 모집)" status="모집중" daysLeft={20} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="교향악단 바이올린 객원단원 채용" type="콩쿨(경연)" status="모집중" daysLeft={20} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="교향악단 바이올린 객원단원 채용" type="입시평가회" status="모집중" daysLeft={20} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="2025 서울 국제 피아노 콩쿨 모집" type="콩쿨(경연)" status="모집중" daysLeft={15} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="오케스트라 단원 모집 공고" type="오디션" status="모집중" daysLeft={8} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="뮤지컬 배우 오디션" type="오디션" status="모집중" daysLeft={22} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="재즈 밴드 멤버 모집" type="밴드" status="모집중" daysLeft={5} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="합창단 단원 모집" type="합창" status="모집중" daysLeft={30} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="바이올린 마스터클래스 참가자 모집" type="마스터클래스" status="모집중" daysLeft={12} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="플루트 연주자 모집" type="오디션" status="모집중" daysLeft={18} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="드럼 연주자 모집" type="밴드" status="모집중" daysLeft={7} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="첼로 연주자 모집" type="오디션" status="모집중" daysLeft={25} />
        </View>
        <View style={styles.cardWrapper}>
          <AnnouncementCard title="클래식 기타 콩쿨" type="콩쿨(경연)" status="모집중" daysLeft={10} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default AnnouncementScreen;

