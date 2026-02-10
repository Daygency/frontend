import { StyleSheet } from "react-native";
import { GRAY, MAIN, WHITE } from "../../../color";

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
    lineHeight: 20,
    fontWeight: "400",
    color: GRAY.DARK,
  },
  tabTextActive: {
    fontWeight: "500",
    color: MAIN.DEFAULT,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 8,
    gap: 8,
  },
  scrollContent: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingBottom: 9,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default styles;

