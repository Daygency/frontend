import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../color";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import FabButton from "../../components/FabButton/FabButton";
import styles from "./styles";

const MOCK_DOCUMENTS = [
  { id: "1", title: "2025 재즈페스티벌 출연계약서", date: "2025.09.15", size: "245 KB" },
  { id: "2", title: "음원 사용 동의서", date: "2025.09.10", size: "180 KB" },
  { id: "3", title: "공연 기획서", date: "2025.08.28", size: "1.2 MB" },
];

const DocumentCard = ({
  title,
  date,
  size,
  onMorePress,
}: {
  title: string;
  date: string;
  size: string;
  onMorePress: () => void;
}) => (
  <ShadowCardButton styles={{ container: styles.card }}>
    <View style={styles.cardContent}>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.cardMeta}>
          {date} · {size}
        </Text>
      </View>
      <Pressable hitSlop={10} onPress={onMorePress} style={styles.moreButton}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={GRAY.DARK_100}
        />
      </Pressable>
    </View>
  </ShadowCardButton>
);

const MyDataArchiveScreen = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_DOCUMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard
            title={item.title}
            date={item.date}
            size={item.size}
            onMorePress={() => {}}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      <FabButton
        onPress={() => {}}
        containerStyle={{ bottom: 24 + bottom }}
      />
    </View>
  );
};

export default MyDataArchiveScreen;
