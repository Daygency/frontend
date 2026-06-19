import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { ReactNode } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import defaultStyles from "./styles";

interface Styles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
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
  const headerContent = (
    <>
      <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
      {onPressMore ? (
        <MaterialIcons name="chevron-right" size={28} color="#000" />
      ) : null}
    </>
  );

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      {onPressMore ? (
        <Pressable
          onPress={onPressMore}
          style={[defaultStyles.header, styles?.header]}
        >
          {headerContent}
        </Pressable>
      ) : (
        <View style={[defaultStyles.header, styles?.header]}>
          {headerContent}
        </View>
      )}
      <View style={[defaultStyles.content, styles?.content]}>{children}</View>
    </View>
  );
}
