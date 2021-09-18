import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import * as firebase from "firebase";
import { Button, Image, Text, } from "react-native-elements";
import { Asset } from 'expo-asset';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, es } from '../i18n/supportedLanguages';

i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const logo = require("../assets/logo.png")

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("students")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email: email,
            created: Date.now(),
            updated: Date.now()
          }, {merge: true})
          .catch((error) => {
            console.error("Error signing in: ", error);
          });
        console.log("User "+firebase.auth().currentUser.uid+" signed in");
      })
      .catch((error) => alert(error));
  };

  const handleSignUp = async () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        handleLogin();
      })
      .then(() => {
        firebase
          .firestore()
          .collection("students")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email: email,
            created: Date.now()
          }, {merge: true})
          .catch((error) => {
            console.error("Error creating user: ", error);
          });
        console.log("User "+firebase.auth().currentUser.uid+" created");
      })
      .catch((error) => alert(error));
  };

  const passwordResetEmail = () => {
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent to: " + email)
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
    });
  }

  return (
    <View style={styles.container}>
      {logo ? (
        <>
      <Image source={logo} style={styles.logo}/>
      <TextInput
        style={styles.spacedinput}
        placeholder={i18n.t("username")}
        value={email}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.spacedinput}
        placeholder="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableHighlight style={styles.spacedinput}>
      <Button
        style={styles.spacedinput}
        title="Sign in"
        onPress={handleLogin}
        buttonStyle={styles.button}
      titleStyle={{color: "black"}}
      raised

      />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput} >
        <Button title="Register" buttonStyle={styles.button}
      titleStyle={{color: "black"}} onPress={handleSignUp}       raised
      />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput}>
        <Button title="Reset password" buttonStyle={styles.button}
      titleStyle={{color: "black"}} onPress={passwordResetEmail}       raised
      />
      </TouchableHighlight>
      </>
) : (
  <>
        <ActivityIndicator size="large" color="#313639" style={styles.spinner} />
  </>
)
}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 100,
    alignItems: 'center'
  },
  spacedinput: {
    margin: 5,
    width: 300
  },
  button: {
    backgroundColor: "white",
    width:300, 
    borderRadius: 10, 
    alignSelf: "center",
    borderRadius: 5
  },
  logo : {
    height: 300,
    width: 300,
    marginBottom: 20
  }
});
