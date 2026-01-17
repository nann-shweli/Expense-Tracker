import React from "react";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => {
  const isLoggedIn = false; 

  return isLoggedIn ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
