import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ReactNode } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface Styles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  more?: StyleProp<TextStyle>;
  content?: StyleProp<ViewStyle>;
}

interface SectionProps {
  title: string;
  onPressMore?: () => void;
  children: ReactNode;
  styles?: Styles;
}

export default function Section({
  title,
  onPressMore,
  children,
  styles,
}: SectionProps) {
  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <View style={[defaultStyles.header, styles?.header]}>
        <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
        {onPressMore && (
          <TouchableOpacity onPress={onPressMore}>
            <View style={defaultStyles.moreContainer}>
              <Text style={[defaultStyles.more, styles?.more]}>더 보기</Text>
              <MaterialIcons
                styles={defaultStyles.moreIcon}
                name="navigate-next"
                size={24}
                color="black"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={[defaultStyles.content, styles?.content]}>{children}</View>
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12 + 8, // 기존 12씩 + 양쪽 4만큼 해서 콘텐츠보다 더 안쪽에 위치하도록 함
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  moreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  more: {
    fontSize: 13,
    color: "#888",
  },
  moreIcon: {},
  content: {
    gap: 5,
    paddingHorizontal: 12,
  },
});
