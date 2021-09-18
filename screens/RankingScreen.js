import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createRef } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as firebase from "firebase";
import { Card } from "react-native-elements";

import RankingFlatList from "../components/RankingFlatList";

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, es } from '../i18n/supportedLanguages';

i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;

const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

export default function RankingScreen({ navigation }) {

    const current_id = firebase.auth().currentUser.uid;
  
    const [students, setStudents] = React.useState([])
    const [student, setStudent] = React.useState([])
    const [rank, setRank] = React.useState(0)
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        firebase
          .firestore()
          .collection("students")
          .orderBy("personalBest", "desc")
          .onSnapshot(
            (snapshot) => {
              const students = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setStudents(students);
              setIsLoading(true)
            },
            (error) => console.log(error)
          );
      }, []);

      useEffect(() => {
        if (students){
            let index = students.findIndex((student) => student.id == current_id)
            setRank(index+1)
        }
      })

      useEffect(() => {
        firebase.firestore().collection("students").doc(current_id).get()
            .then(snapshot => setStudent(snapshot.data()))
      }, [])

      const onRefresh = React.useCallback(() => {
        firebase
          .firestore()
          .collection("students")
          .orderBy("personalBest", "desc")
          .onSnapshot(
            (snapshot) => {
              const students = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setStudents(students);
            },
            (error) => console.log(error)
          );
        setRefreshing(true);
    
        wait(1000).then(() => setRefreshing(false));
      }, []);

  return (
    <View style={styles.container}>
      { isLoading ? (
        <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        <View style={styles.row_container}>
        <Card containerStyle={styles.stats_card}>  
          <Card.Title>{i18n.t("yourBestScore")}</Card.Title>  
          <Card.Divider/>
          <Text style={styles.center_text}>{student.personalBest}</Text>
        </Card>
        <Card containerStyle={styles.stats_card}>  
          <Card.Title>{i18n.t("currentRanking")}</Card.Title>  
          <Card.Divider/>
          <Text style={styles.center_text}>{"#"+rank}</Text>
        </Card>
        </View>
        <RankingFlatList students={students}/>
        </ScrollView>
      ) : (<ActivityIndicator size="large" color="#313639" style={styles.spinner} />

      )
          }
    </View>
        
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    alignItems: "center",
    paddingTop: 10
  },
  center_text: {
      textAlign: "center",
      fontSize: 40
  },
  row_container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    maxHeight: 150,
    justifyContent: "space-evenly",
},
stats_card: {
    width: 150
},
spinner: {
  flex: 1,
  alignItems: "center",
}
});
