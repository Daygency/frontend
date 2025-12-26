import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY, BLACK } from "../../../../color";

const ProfileDetail = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>소개</Text>
        <Text style={styles.sectionContent}>
          안녕하세요. 저는 클래식 피아니스트입니다. 다양한 공연 활동을 통해 음악을 사랑하는 분들과 소통하고 있습니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>학력</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 서울대학교 음악대학 피아노과 졸업</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 독일 베를린 예술대학 석사</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>경력</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 2020년 - 현재: 프리랜서 피아니스트</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 2018년 - 2020년: 서울심포니 오케스트라 객원 연주자</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>수상 경력</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 2019년 국제 피아노 콩쿠르 1등</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>• 2017년 청소년 음악 콩쿠르 최우수상</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>연락처</Text>
        <Text style={styles.sectionContent}>Email: artist@example.com</Text>
        <Text style={styles.sectionContent}>Phone: 010-1234-5678</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetail;

