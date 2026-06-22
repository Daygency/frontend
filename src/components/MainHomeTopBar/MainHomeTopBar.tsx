import { Image, Pressable, View, type ImageSourcePropType } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { MAIN } from "../../color";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../navigations/routes";
import type { ContentTabParamList, RootStackParamList } from "../../navigations/types";

type MainHomeTopBarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<ContentTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MainHomeTopBarProps {
  logoName?: string;
  logoImage?: ImageSourcePropType;
  initialTag?: string | null;
}

const MainHomeTopBar = ({ logoName, logoImage, initialTag }: MainHomeTopBarProps) => {
  const navigation = useNavigation<MainHomeTopBarNavigationProp>();

  const handleSearchPress = () => {
    if (initialTag) {
      navigation.navigate(RootRoutes.SEARCH, { initialTag });
      return;
    }
    navigation.navigate(RootRoutes.SEARCH);
  };

  return (
    <View style={styles.container}>
      {logoImage ? (
        <Image
          source={logoImage}
          style={{
            height: 24,
            aspectRatio: 1396 / 179,
            maxWidth: 120,
            flexShrink: 1,
          }}
          resizeMode="contain"
          accessibilityLabel="daygency"
        />
      ) : (
        <Logo size={24} logoName={logoName ?? ""} />
      )}
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton} onPress={handleSearchPress}>
          <Feather name="search" size={23} color={MAIN.DEFAULT} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={MAIN.DEFAULT}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={23}
            color={MAIN.DEFAULT}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default MainHomeTopBar;
