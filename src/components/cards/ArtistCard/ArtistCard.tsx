import UserProfileAvatar from "../../ui/UserProfileAvatar";
import ShadowCardButton from "../../cards/ShadowCardButton";
import { Text, View } from "react-native";
import styles from "./styles";
import MusicNoteIcon from "../../../../assets/music_note.svg";

interface ArtistCardProps {
  name: string;
  category: string;
  avatarUrl?: string;
  activityName?: string;
  musicNoteCount?: number;
  onPress?: () => void;
}

const ArtistCard = ({
  name,
  category,
  avatarUrl,
  musicNoteCount = 0,
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
        <View style={styles.avatarContainer}>
          <UserProfileAvatar profileImgUrl={avatarUrl} size={50} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>

        <View style={styles.iconsContainer}>
          <View style={styles.iconWithCount}>
            <MusicNoteIcon width={20} height={20} />
            <Text style={styles.musicNoteCount}>{musicNoteCount}</Text>
          </View>
        </View>
      </View>
    </ShadowCardButton>
  );
};

export default ArtistCard;
