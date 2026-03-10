import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import ArtistIcon from "../../components/ArtistIcon/ArtistIcon";
import AgencyIcon from "../../components/AgencyIcon/AgencyIcon";
import { styles } from "./styles";

export type UserRole = "artist" | "planner";

const RoleSelectionScreen = () => {
  const { completeSignup } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        styles.contentContainer,
        { paddingTop: top + 48, paddingBottom: bottom + 24 },
      ]}
    >
      <Text style={styles.logoText}>DAYGENCY</Text>

      <Text style={styles.mainQuestion}>
        {"데이전시를,\n어떤 역할로 이용하시겠어요?"}
      </Text>

      <Text style={styles.subText}>
        선택한 역할에 맞춰 프로필 형식이 생성됩니다.
      </Text>
      <Text style={styles.noteText}>두 역할 모두 기능은 동일합니다.</Text>

      <View style={styles.optionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.roleOption,
            styles.artistOption,
            pressed && styles.optionPressed,
          ]}
          onPress={() => completeSignup("artist")}
        >
          <View style={[styles.iconWrap, styles.artistIconWrap]}>
            <ArtistIcon width={56} height={56} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.roleTitle}>아티스트로 시작하기</Text>
            <Text style={styles.roleDescription}>
              예술가로서의 여러 활동을 더 활발하게 이어가고 싶어요
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.roleOption,
            styles.plannerOption,
            pressed && styles.optionPressed,
          ]}
          onPress={() => completeSignup("planner")}
        >
          <View style={[styles.iconWrap, styles.plannerIconWrap]}>
            <AgencyIcon width={56} height={56} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.roleTitle}>기획자로 시작하기</Text>
            <Text style={styles.roleDescription}>
              공연 기획의 전 과정을 한 곳에서 관리하고 싶어요
            </Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.footerText}>
        가입 후에 두 역할 모두 사용할 수 있어요.
      </Text>
    </View>
  );
};

export default RoleSelectionScreen;
