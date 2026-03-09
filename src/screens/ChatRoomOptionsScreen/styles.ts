import { StyleSheet } from "react-native";
import { WHITE, GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
  },
  backButton: {
    padding: 4,
  },
  content: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRAY.DEFAULT,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  optionDivider: {
    height: 1,
    backgroundColor: GRAY.DEFAULT,
    marginHorizontal: 12,
  },
});

export default styles;
