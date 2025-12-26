import { View, Text, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Tag from "../../../../components/Tag/Tag";
import styles from "./styles";
import { BLACK, WHITE } from "../../../../color";

interface PersonItemProps {
  person: {
    name: string;
    tag: string;
    introduction: string;
    profileImage: string | null;
  };
}

const PersonItem = ({ person }: PersonItemProps) => {
  const isArtist = person.tag === "예술가";

  return (
    <View style={styles.container}>
      {person.profileImage ? (
        <Image source={{ uri: person.profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{person.name}</Text>
          <Tag
            text={person.tag}
            backgroundColor={isArtist ? "#EBBF4B" : "#6A36FF"}
            textColor={WHITE}
          />
        </View>
        <Text style={styles.introduction}>{person.introduction}</Text>
      </View>

      <Pressable style={styles.deleteButton} onPress={() => {}}>
        <MaterialCommunityIcons name="close" size={24} color={BLACK} />
      </Pressable>
    </View>
  );
};

export default PersonItem;
