import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  tabActive: {
    backgroundColor: GRAY.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK,
  },
  tabTextActive: {
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default styles;

