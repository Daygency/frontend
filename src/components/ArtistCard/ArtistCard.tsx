import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, WHITE } from "../../color";
import styles from "./styles";

interface ArtistCardProps {
  name: string;
  category: string;
  bookmarkCount: number;
}

const ArtistCard = ({ name, category, bookmarkCount }: ArtistCardProps) => {
  return (
    <ShadowCardButton styles={{container: {borderRadius: 15, paddingVertical: 12, paddingHorizontal: 16}}}>
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

export default ArtistCard;

