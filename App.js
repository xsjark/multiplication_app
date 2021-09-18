import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, LogBox } from "react-native";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "./config.js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignOutScreen from "./screens/SignOutScreen";
import RankingScreen from "./screens/RankingScreen";

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, es } from './i18n/supportedLanguages';

i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;

LogBox.ignoreLogs(["Setting a timer"]);

try {
  firebase.initializeApp(FIREBASE_CONFIG);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error raised", err.stack);
  }
}

const Stack = createStackNavigator();
const RestaurantStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Restaurant = () => (
  <RestaurantStack.Navigator>
  <RestaurantStack.Screen
    name="Profile"
    component={ProfileScreen}
    options={{ headerShown: false , title: "Profile"}}
  />
  </RestaurantStack.Navigator>
)

const UserStack = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name={i18n.t("home")}
      component={HomeScreen}
      options={{ headerShown: true, title: i18n.t("home") }}
    />
    <Drawer.Screen
      name={i18n.t("ranking")}
      component={RankingScreen}
      options={{ headerShown: true, title: i18n.t("ranking") }}
    />
    <Drawer.Screen
      name={i18n.t("signOut")}
      component={SignOutScreen}
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={i18n.t("signIn")}
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <NavigationContainer >
      {user ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
