import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import searchScreenStyles from "../../SearchScreen/styles";
import { GRAY } from "../../../color";

interface SearchResultsHeaderProps {
  selectedTag: string | null;
  query: string;
  onBack: () => void;
  onResetSearch: () => void;
}

const SearchResultsHeader = ({
  selectedTag,
  query,
  onBack,
  onResetSearch,
}: SearchResultsHeaderProps) => {
  return (
    <View style={searchScreenStyles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={searchScreenStyles.backButton}>
        <MaterialCommunityIcons name="chevron-left" size={28} color="#000" />
      </Pressable>
      <View style={searchScreenStyles.searchBar}>
        {selectedTag !== null && (
          <View style={searchScreenStyles.searchTagChip}>
            <Text style={searchScreenStyles.searchTagChipText}>{selectedTag}</Text>
          </View>
        )}
        <Text
          style={[
            searchScreenStyles.searchInput,
            selectedTag && searchScreenStyles.searchInputWithTag,
            !query && { color: GRAY.DARK },
          ]}
          numberOfLines={1}
        >
          {query || (selectedTag ? "추가 검색어 입력" : "검색어를 입력하세요")}
        </Text>
      </View>
      <Pressable onPress={onResetSearch} hitSlop={10} style={searchScreenStyles.clearButton}>
        <MaterialCommunityIcons name="close" size={24} color={GRAY.DARK} />
      </Pressable>
    </View>
  );
};

export default SearchResultsHeader;
