import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import { BLACK, WHITE } from "../../color";
import styles from "./styles";
import MusicNoteIcon from "../../../assets/music_note.svg";
interface ArtistCardProps {
  name: string;
  category: string;
  activityName?: string;
  musicNoteCount?: number;
  bookmarkCount: number;
  onPress?: () => void;
}

const ArtistCard = ({
  name,
  category,
  activityName,
  musicNoteCount = 0,
  bookmarkCount,
  onPress,
}: ArtistCardProps) => {
  return (
    <ShadowCardButton
      onPress={onPress}
      styles={{
        container: {
          borderRadius: 15,
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
      }}
    >
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

        {/* Music Note & Bookmark Icons with Counts */}
        <View style={styles.iconsContainer}>
          <View style={styles.iconWithCount}>
            <MusicNoteIcon width={20} height={20} />
            <Text style={styles.musicNoteCount}>{musicNoteCount}</Text>
          </View>
          <View style={styles.iconWithCount}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color={BLACK}
            />
            <Text style={styles.bookmarkCount}>{bookmarkCount}</Text>
          </View>
        </View>
      </View>
    </ShadowCardButton>
  );
};

export default ArtistCard;

