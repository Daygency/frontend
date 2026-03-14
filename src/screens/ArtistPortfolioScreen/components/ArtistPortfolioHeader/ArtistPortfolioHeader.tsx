import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../../PortfolioScreen/styles";
import styles from "./styles";

interface ArtistPortfolioHeaderProps {
  activityName: string;
}

const ArtistPortfolioHeader = ({ activityName }: ArtistPortfolioHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#000"
          />
        </Pressable>
        <Text style={styles.activityName} numberOfLines={1}>
          @{activityName}
        </Text>
      </View>
    </View>
  );
};

export default ArtistPortfolioHeader;
