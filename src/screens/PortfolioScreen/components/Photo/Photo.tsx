import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { GRAY } from "../../../../color";

export const PHOTO_PREVIEW_LIMIT = 4;

export type PortfolioPhoto = {
  id: number;
  uri: string | null;
};

// 임시 이미지 데이터
export const PORTFOLIO_PHOTOS: PortfolioPhoto[] = [
  { id: 1, uri: null },
  { id: 2, uri: null },
  { id: 3, uri: null },
  { id: 4, uri: null },
  { id: 5, uri: null },
  { id: 6, uri: null },
];

type PhotoProps = {
  embedded?: boolean;
  /** 지정 시 해당 개수만 표시 (프로필 탭 미리보기) */
  limit?: number;
};

const Photo = ({ embedded = false, limit }: PhotoProps) => {
  const photos =
    limit != null ? PORTFOLIO_PHOTOS.slice(0, limit) : PORTFOLIO_PHOTOS;

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
