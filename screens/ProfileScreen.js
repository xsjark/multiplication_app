import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createRef } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import * as firebase from "firebase";
import { Text } from "react-native-elements";



export default function ProfileScreen({ navigation }) {
  
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text> 
    </View>
        
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
});
