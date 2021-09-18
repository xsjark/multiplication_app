import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

import Question from "../components/Question";
export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Question />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height:"100%", 
    width:"100%", 
    flex:1
  },
  
});
