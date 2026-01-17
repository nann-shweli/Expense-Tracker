import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Login from "../screens/auth/login";
import OTP from "../screens/auth/OTP";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OTP" component={OTP} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
