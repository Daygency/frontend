import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import { Ionicons } from "@expo/vector-icons";
import Section from "../../../../components/Section/Section";
import ShadowCardButton from "../../../../components/ShadowCardButton/ShadowCardButton";
import ReviewCard from "../../../../components/ReviewCard/ReviewCard";

const Activity = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.activityContiner}>
          <View style={styles.activityCountItem}>
            <Text>활동 횟수</Text>
            <Text>15회</Text>
          </View>
          <View style={styles.activityTempoItem}>
            <Text>예술 템포</Text>
            <Text>84점</Text>
          </View>
        </View>
        <Section
          title="받은 후기"
          onPressMore={() => {}}
          styles={{ title: { marginTop: 12 } }}
        >
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </Section>
      </View>
    </ScrollView>
  );
};

export default Activity;
