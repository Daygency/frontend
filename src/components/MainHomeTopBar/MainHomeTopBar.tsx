import { Image, Pressable, View, type ImageSourcePropType } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { MAIN, WHITE } from "../../color";
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
  logoAspectRatio?: number;
  initialTag?: string | null;
  variant?: "light" | "dark";
}

const MainHomeTopBar = ({
  logoName,
  logoImage,
  logoAspectRatio = 1396 / 179,
  initialTag,
  variant = "light",
}: MainHomeTopBarProps) => {
  const navigation = useNavigation<MainHomeTopBarNavigationProp>();
  const iconColor = variant === "dark" ? WHITE : MAIN.DEFAULT;

  const handleSearchPress = () => {
    if (initialTag) {
      navigation.navigate(RootRoutes.SEARCH, { initialTag });
      return;
    }
    navigation.navigate(RootRoutes.SEARCH);
  };

  const logoHeight = variant === "dark" ? 18 : 24;
  const logoMaxWidth = variant === "dark" ? 22 : 120;
  const logoWidth = Math.min(logoHeight * logoAspectRatio, logoMaxWidth);

  return (
    <View style={styles.container}>
      {logoImage ? (
        <View
          style={{
            width: logoWidth,
            height: logoHeight,
            flexShrink: 1,
          }}
        >
          <Image
            source={logoImage}
            style={{
              width: logoWidth,
              height: logoHeight,
            }}
            resizeMode="contain"
            accessibilityLabel="daygency"
          />
        </View>
      ) : (
        <Logo size={24} logoName={logoName ?? ""} />
      )}
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton} onPress={handleSearchPress}>
          <Feather name="search" size={23} color={iconColor} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={iconColor}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={23}
            color={iconColor}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default MainHomeTopBar;
