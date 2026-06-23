import { Image, Pressable, View, type ImageSourcePropType } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../../ui/Logo";
import { MAIN, WHITE } from "../../../color";
import styles, { MAIN_HOME_TOP_BAR_TITLE_SIZE } from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../navigations/routes";
import type { ContentTabParamList, RootStackParamList } from "../../../navigations/types";
import { useRequireLogin } from "../../../hooks/useRequireLogin";

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
  const { ensureLoggedIn } = useRequireLogin();
  const iconColor = variant === "dark" ? WHITE : MAIN.DEFAULT;

  const handleSearchPress = () => {
    if (initialTag) {
      navigation.navigate(RootRoutes.SEARCH, { initialTag });
      return;
    }
    navigation.navigate(RootRoutes.SEARCH);
  };

  const logoHeight =
    variant === "dark" ? 16 : MAIN_HOME_TOP_BAR_TITLE_SIZE;
  const logoMaxWidth = variant === "dark" ? 20 : 110;
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
        <Logo logoName={logoName ?? ""} />
      )}
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton} onPress={handleSearchPress}>
          <Feather name="search" size={23} color={iconColor} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (!ensureLoggedIn()) return;
            navigation.navigate(RootRoutes.NOTIFICATIONS);
          }}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={iconColor}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (!ensureLoggedIn()) return;
            navigation.navigate(RootRoutes.SETTINGS);
          }}
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
