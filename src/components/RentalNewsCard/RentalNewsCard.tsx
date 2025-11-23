import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

interface RentalNewsCardProps {
  title: string;
  venueName: string;
  date: string;
}

const RentalNewsCard = ({
  title,
  venueName,
  date,
}: RentalNewsCardProps) => {
  return (
    <ShadowCardButton styles={{container: {paddingTop: 16, paddingBottom: 17, paddingHorizontal: 16}}}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.venueName}>{venueName}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </ShadowCardButton>
  );
};

export default RentalNewsCard;

