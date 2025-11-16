import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, GRAY, WHITE } from "../../color";

interface ArtistCardProps {
  name: string;
  category: string;
  bookmarkCount: number;
}

const ArtistCard = ({ name, category, bookmarkCount }: ArtistCardProps) => {
  return (
    <ShadowCardButton>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color={WHITE}
          />
        </View>

        {/* Name and Category */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>

        {/* Bookmark Icon and Count */}
        <View style={styles.bookmarkContainer}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={20}
            color={BLACK}
          />
          <Text style={styles.bookmarkCount}>{bookmarkCount}</Text>
        </View>
      </View>
    </ShadowCardButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: GRAY.MEDIUM,
    borderWidth: 1,
    borderColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  bookmarkContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkCount: {
    fontSize: 14,
    fontWeight: "400",
    color: BLACK,
    marginTop: 4,
  },
});

export default ArtistCard;

