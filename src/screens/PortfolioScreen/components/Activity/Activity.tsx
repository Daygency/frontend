import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import { Ionicons } from "@expo/vector-icons";

const Activity = () => {
  // 임시 활동 데이터
  const activities = [
    {
      id: 1,
      title: "2024 봄 콘서트",
      date: "2024.03.15",
      location: "예술의전당",
      type: "공연",
    },
    {
      id: 2,
      title: "음악 페스티벌 참여",
      date: "2024.02.20",
      location: "세종문화회관",
      type: "공연",
    },
    {
      id: 3,
      title: "마스터클래스 진행",
      date: "2024.01.10",
      location: "서울대학교",
      type: "교육",
    },
    {
      id: 4,
      title: "앨범 발매",
      date: "2023.12.01",
      location: "온라인",
      type: "앨범",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <View style={styles.activityTypeBadge}>
              <Text style={styles.activityTypeText}>{activity.type}</Text>
            </View>
          </View>
          <View style={styles.activityInfo}>
            <View style={styles.activityInfoRow}>
              <Ionicons name="calendar-outline" size={14} color={GRAY.DARK} />
              <Text style={styles.activityInfoText}>{activity.date}</Text>
            </View>
            <View style={styles.activityInfoRow}>
              <Ionicons name="location-outline" size={14} color={GRAY.DARK} />
              <Text style={styles.activityInfoText}>{activity.location}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Activity;

