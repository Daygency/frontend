import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { ReactNode } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import defaultStyles from "./styles";

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
        {onPressMore ? (
          <Pressable onPress={onPressMore}>
            <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
          </Pressable>
        ) : (
          <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
        )}
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
