import { View, Text } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { Entypo } from "@expo/vector-icons";
import styles from "./styles";
import Tag from "../Tag/Tag";

const ReviewCard = () => {
  return (
    <ShadowCardButton>
      <View style={styles.header}>
        <View style={styles.profileContainer} />
        <View style={styles.profileNameContainer}>
          <Text>이XX</Text>
          <Text>2025.09.20</Text>
        </View>
        <View style={styles.dotsContainer}>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>2025년도 봄 정기 연주회</Text>
        <Text style={styles.content}>
          저는 봄 정기 연주회에 참가했습니다. 좋은 경험이었습니다.
        </Text>
      </View>

      <View style={styles.tagContainer}>
        <Tag text="봄 정기 연주회" variant="type" />
        <Tag text="좋은 경험" variant="status" />
      </View>
    </ShadowCardButton>
  );
};

export default ReviewCard;
