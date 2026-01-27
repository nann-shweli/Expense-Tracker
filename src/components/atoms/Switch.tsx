import React from "react";
import { View, Switch, StyleSheet } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const SwitchCom = ({ value, onValueChange }: Props) => {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#000000", true: "#1E88E5" }}
        thumbColor={value ? "#0D47A1" : "#FFFFFF"}
        ios_backgroundColor="#2A2F3A"
      />
    </View>
  );
};

export default SwitchCom;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});
