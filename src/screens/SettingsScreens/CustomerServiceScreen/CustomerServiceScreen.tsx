import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import CategoryTabBar from "../../../components/layout/CategoryTabBar";
import InquiryTab from "./components/InquiryTab";
import InquiryHistoryTab from "./components/InquiryHistoryTab";
import styles from "./styles";

const CustomerServiceScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "inquiry", title: "문의하기" },
    { key: "history", title: "문의내역" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "inquiry":
        return <InquiryTab />;
      case "history":
        return <InquiryHistoryTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <CategoryTabBar {...props} evenlyDistributed />
        )}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </View>
  );
};

export default CustomerServiceScreen;
