import { StyleSheet, Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

interface AnnouncementCardProps {
  title: string;
  type?: string;
  status?: string;
  daysLeft?: number;
}

const AnnouncementCard = ({
  title,
  type = "콩쿨(경연)",
  status = "모집중",
  daysLeft = 20,
}: AnnouncementCardProps) => {
  return (
    <ShadowCardButton>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.tagsContainer}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{type}</Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusTagText}>{status}</Text>
            </View>
          </View>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>D-{daysLeft}</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </ShadowCardButton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  typeTag: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "400",
  },
  statusTag: {
    backgroundColor: WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BLACK,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "400",
  },
  countdownBadge: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    color: BLACK,
    fontWeight: "600",
    lineHeight: 22,
  },
});

export default AnnouncementCard;
