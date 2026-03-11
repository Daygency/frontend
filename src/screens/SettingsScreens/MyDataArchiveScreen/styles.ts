import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  cardManage: {
    marginBottom: 0,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cardMeta: {
    fontSize: 14,
    color: GRAY.DARK_2,
    marginTop: 4,
  },
  moreButton: {
    padding: 4,
  },
  cardRow: {
    marginBottom: 12,
  },
  cardRowManage: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GRAY.DARK_1,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectCircleSelected: {
    backgroundColor: GRAY.DARK_100,
    borderColor: GRAY.DARK_100,
  },
  listContentManage: {
    paddingBottom: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM,
  },
  bottomBarButton: {
    alignItems: "center",
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 14,
    color: GRAY.DARK_100,
    marginTop: 8,
  },
});

export default styles;
