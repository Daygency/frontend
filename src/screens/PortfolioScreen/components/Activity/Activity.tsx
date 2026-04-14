import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import { Ionicons } from "@expo/vector-icons";
import Section from "../../../../components/Section/Section";
import ShadowCardButton from "../../../../components/ShadowCardButton/ShadowCardButton";
import ReviewCard from "../../../../components/ReviewCard/ReviewCard";

type ActivityProps = {
  embedded?: boolean;
};

const Activity = ({ embedded = false }: ActivityProps) => {
  const inner = (
    <View style={embedded ? styles.embeddedContainer : styles.container}>
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
        <ReviewCard
          title="2025년도 봄 정기 연주회"
          content="저는 봄 정기 연주회에 참가했습니다. 좋은 경험이었습니다."
          tags={[
            { text: "봄 정기 연주회", variant: "type" },
            { text: "좋은 경험", variant: "status" },
          ]}
        />
        <ReviewCard
          title="2025년도 봄 정기 연주회"
          content="저는 봄 정기 연주회에 참가했습니다. 좋은 경험이었습니다."
          tags={[
            { text: "봄 정기 연주회", variant: "type" },
            { text: "좋은 경험", variant: "status" },
          ]}
        />
        <ReviewCard
          title="2025년도 봄 정기 연주회"
          tags={[
            { text: "봄 정기 연주회", variant: "type" },
            { text: "좋은 경험", variant: "status" },
          ]}
        />
      </Section>
    </View>
  );

  if (embedded) {
    return inner;
  }

  return <ScrollView>{inner}</ScrollView>;
};

export default Activity;
