import { Text, View } from "react-native";
import ShadowCardButton from "../ShadowCardButton/ShadowCardButton";
import styles from "./styles";

export interface SearchResultCardProps {
  title: string;
  subtitle?: string;
  date?: string;
  onPress?: () => void;
}

const SearchResultCard = ({
  title,
  subtitle,
  date,
  onPress,
}: SearchResultCardProps) => {
  return (
    <ShadowCardButton onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.bottomRow}>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : (
            <View />
          )}
          {date ? (
            <Text style={styles.date}>{date}</Text>
          ) : null}
        </View>
      </View>
    </ShadowCardButton>
  );
};

export default SearchResultCard;
