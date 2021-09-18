import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { Avatar, Card, ListItem } from 'react-native-elements'

const protect_email = (user_email) => {
  var avg, splitted, part1, part2;
  splitted = user_email.split("@");
  part1 = splitted[0];
  avg = part1.length / 2;
  part1 = part1.substring(0, (part1.length - avg));
  part2 = splitted[1];
  return part1 + "...@" + part2;
}; 
const Item = ({ id, index, score, email }) => (
  <ListItem bottomDivider>    
  <Avatar  
    title={"#"+(index+1)} 
    rounded
    containerStyle={{backgroundColor:"grey"}}
  />
  <ListItem.Content>      
    <ListItem.Title>{score + " points"}</ListItem.Title>      
  <ListItem.Subtitle>{protect_email(email)}</ListItem.Subtitle>    
  </ListItem.Content>    
  </ListItem>
);

const RankingFlatList = (props) => {
  const renderItem = ({ item, index }) => (
    <Item id={item.id} index={index} score={item.personalBest} email={item.email}/>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Card>
      <Card.Title>Leaderboard</Card.Title>  
      <Card.Divider/>
      <FlatList
        data={props.students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    width: 360
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default RankingFlatList;