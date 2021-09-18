import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createRef } from "react";
import {
    ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import * as firebase from "firebase";
import { Button, Card, Icon, Input, Text } from "react-native-elements";

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, es } from '../i18n/supportedLanguages';

i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;

const answerInput = React.createRef();

const Question = () => {

    const current_id = firebase.auth().currentUser.uid;

    const [answer, setAnswer] = React.useState(null);
    const [firstNumber, setFirstNumber] = React.useState(null)
    const [secondNumber, setSecondNumber] = React.useState(null)
    const [points, setPoints] = React.useState(null)
    const [mistakes, setMistakes] = React.useState(null)
    const [iconOpacity, setIconOpacity] = React.useState(0)
    const [student, setStudent] = React.useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        firebase.firestore().collection("students").doc(current_id).get()
            .then(snapshot => setStudent(snapshot.data()))
            .then(setIsLoading(true))
      }, [points])

      const updateHighScore = async (x) => {
        if (x) {
          firebase
            .firestore()
            .collection("students")
            .doc(firebase.auth().currentUser.uid)
            .set({ personalBest: x }, { merge: true })
            .catch((error) => {
              alert("Error updating personal best: ", error);
            });
          console.log("Personal best " + firebase.auth().currentUser.uid + " updated!");
        } else {
            return
        }
      };

    const check = () => {
        if (answer == firstNumber*secondNumber){
            setPoints(points + 1)
            setIconOpacity(1)
            wait(1000).then(() => {setIconOpacity(0)
            answerInput.current.clear();
            generateQuestion()
        })
     } else {
            setMistakes(mistakes + 1)
            setIconOpacity(1)
            wait(1000).then(() => {
                setIconOpacity(0)
                answerInput.current.clear();
            })
            if (mistakes >= 2) {
                if (!student.personalBest || points > student.personalBest) {
                    alert(i18n.t("newPersonalBestMsg")  + " " + points)
                    updateHighScore(points)
                    setPoints(null)
                    setMistakes(null)
                } else {
                    alert(i18n.t("gameOver")  + " " + points)
                    setPoints(null)
                    setMistakes(null)
                } 
            }
        }
    }

    const generateQuestion = () => {
        let first_number = Math.floor(Math.random() * 10)
        let second_number = Math.floor(Math.random() * 11)

        setFirstNumber(first_number)
        setSecondNumber(second_number)
    }

    
    (useEffect(() => {
        generateQuestion()
    }, []))

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

  return (

    <KeyboardAvoidingView style={styles.container}>
        { isLoading ?
        (<View>
            <View style={styles.score_container}>
        <Text style={styles.score}>{i18n.t("personalBest")}: {student.personalBest ? student.personalBest : 0}</Text>
        <Text style={styles.score}>{i18n.t("points")}: {points ? points : 0}</Text>
        <Text style={styles.score}>{i18n.t("mistakes")}: {mistakes ? mistakes : 0}/3</Text>
        </View>

    <Card containerStyle={styles.question_card}>
<View style={styles.row_container}>
      <Text style={styles.question}>{firstNumber ? firstNumber : 0} x {secondNumber ? secondNumber : 0} = </Text> 
      <Input
       keyboardType="numeric"
       onChangeText={setAnswer}
       onSubmitEditing={check}
       containerStyle={{width: 70 }}
       inputStyle={styles.question}
       ref={answerInput}
       textAlign={"center"}
       maxLength={2}
       />
       <Icon  
        name={answer == firstNumber*secondNumber ? "check" : "close"}
        size={40}
        containerStyle={{bottom: -10}}
        iconStyle={{
            color: answer == firstNumber*secondNumber ? "green" : "red", 
            opacity: iconOpacity
        }}
        type='font-awesome'
        />
        </View>
    </Card>
    </View>) : (
    <ActivityIndicator size="large" color="#313639" style={styles.spinner} />

    )
        }

        
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
},
question_card: {
    flex: 1,
    marginTop: 150,
    marginBottom: 100,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 150,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    width: 300,
    borderRadius: 5
},
question_img: {
    marginBottom: 80
},
row_container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 0,
    paddingHorizontal: 30,
    paddingVertical: 30,
},
score_container: {
    marginVertical: 20,
    right: 0,
},
score: {
    textAlign: "right"
},
question: {
    fontSize: 40
},
spinner: {
    flex: 1,
    alignItems: "center",
}
});

export default Question;