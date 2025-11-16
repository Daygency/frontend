import { StyleSheet, Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, GRAY } from "../../color";

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
    <ShadowCardButton>
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

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueName: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  date: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
});

export default RentalNewsCard;

