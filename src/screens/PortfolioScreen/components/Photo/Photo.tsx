import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY } from "../../../../color";

type PhotoProps = {
  embedded?: boolean;
};

const Photo = ({ embedded = false }: PhotoProps) => {
  // 임시 이미지 데이터
  const photos = [
    { id: 1, uri: null },
    { id: 2, uri: null },
    { id: 3, uri: null },
    { id: 4, uri: null },
    { id: 5, uri: null },
    { id: 6, uri: null },
  ];

  const grid = (
    <View style={styles.grid}>
      {photos.map((photo) => (
        <View key={photo.id} style={styles.photoItem}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>사진</Text>
          </View>
        </View>
      ))}
    </View>
  );

  if (embedded) {
    return grid;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {grid}
    </ScrollView>
  );
};

export default Photo;

