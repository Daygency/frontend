import { StyleSheet, Text, View } from "react-native";
import { WHITE } from "../color";

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Payment</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE ,
  },
});

export default PaymentScreen;
