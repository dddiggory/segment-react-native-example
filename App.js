import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TextInput, Alert, ScrollView, Image, FlatList, TouchableOpacity, LayoutAnimation } from 'react-native';
import { createStackNavigator, } from 'react-navigation';
import { Card, List, ListItem, Button, Tile, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import  Analytics, { AnalyticsConstants } from 'react-native-analytics-segment-io'

Analytics.setup('6f4pcfvQXv60D3gWgB1YUAW8N5A82Tu8', {trackApplicationLifecycleEvents: true})

class SplashScreen extends React.Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Image 
            source={{uri:'https://upload.wikimedia.org/wikipedia/en/b/b3/Countable_logo.png'}}
            style={{width: 320, height: 50}}
            resizeMode='contain'/>
          <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
            Your government, made simple.
          </Text>
          <Text style={{textAlign: 'justify', padding: 30}}>
            Get clear, concise summaries of bills going through Congress, see what others think, then take action. Telling your reps how you feel is easier than ever with email and now video messages. Make your democracy more responsive!
          </Text>

          <TextInput 
            placeholder="username or email" 
            style={{backgroundColor: 'white', width: 200, textAlign: 'center', fontSize: 20}} 
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}/>
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = { title: "Home" }
  render() {

    Analytics.screen('Home');
    Analytics.track('App Launch');

    return(
      <View style={{flex: 1}}>
        <View style={{top: 40, alignItems: 'center', flex: 0.6}}>
          <Image 
            source={{uri:'https://upload.wikimedia.org/wikipedia/en/b/b3/Countable_logo.png'}}
            style={{width: 320, height: 50}}
            resizeMode='contain'/>
          <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
            Your government, made simple.
          </Text>
          <Text style={{textAlign: 'justify', padding: 30}}>
            Get clear, concise summaries of bills going through Congress, see what others think, then take action. Telling your reps how you feel is easier than ever with email and now video messages. Make your democracy more responsive!
          </Text>

        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>

        <FlatList
          data={BillsData}
          style={{width: 375, alignSelf: 'center'}}
          renderItem={({item}) => 
            <View style={{padding:5}}>
              <Button 
                title={item.key}
                buttonStyle={{backgroundColor: '#2f9bfc', borderRadius: 10, padding: 15}}
                textStyle={{color: 'white', fontFamily: 'AvenirNext-Medium', textAlign: 'center', fontSize: 15}}
                onPress={() => this.props.navigation.navigate('BillDetail', {item})}
              />
            </View>}
          />


        </View>
        
        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
          <Text>Footer</Text>
        </View>

      </View>
    );
  }

}

class BillsScreen extends React.Component {
  static navigationOptions = { title: "View Bill" }
  render() {


    const { navigation } = this.props;
    const billData = navigation.getParam('item')
    const yeaButton = () => <Text style={{color: 'green'}}>
      Vote Yea
      </Text>
    const nayButton = () => <Text style={{color: 'red'}}>Vote Nay</Text>
    const buttons = [{ element: yeaButton }, { element: nayButton }]
    let userHasScrolled = false

    Analytics.screen('Bill', { 'Bill Name': billData.key });
    Analytics.track('Bill View', { 'Bill Name': billData.key, 'Bill ID': billData.billRef, 'Bill IMG URI': billData.imgURI });

    return(
      <View style={{ flex: 1}}>
        <View style={{flex: 0.5}}>
          <Tile imageSrc={{uri: billData.imgURI}} title={billData.key} featured height={280}/>
        </View>
          
        <View style={{flex: 1}}>
        <Card height={350}>
          <ScrollView 
            onScrollBeginDrag={function() {userHasScrolled = true}}>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Full Bill Description</Text><Text style={styles.billdetailbody}>{billData.billDetail}</Text>
            <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#05ab8e'}}>{"\n"}'Yea' Argument</Text><Text style={styles.billdetailbody}>{billData.billYea}</Text>
            <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#f9665c'}}>{"\n"}'Nay' Argument</Text><Text style={styles.billdetailbody}>{billData.billNay}</Text>
          </ScrollView>
        </Card>
            
        </View>

        <View flex={0.35} style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button title='Vote Yea' buttonStyle={{
          backgroundColor: '#05ab8e', 
          width: 150,
          borderRadius: 10,
        }} onPress={function() {
          Alert.alert("Thanks for voting Yea!");
          Analytics.track("Vote", {"Current Bill": billData.key, "Vote Type": "Yea", "User Scrolled?": userHasScrolled});
        }}/>
        <Button title='Vote Nay' buttonStyle={{
          backgroundColor: '#f9665c', 
          width: 150,
          borderRadius: 10,
        }} onPress={function() {
          Alert.alert("Thanks for voting Nay!");
          Analytics.track("Vote", {"Current Bill": billData.key, "Vote Type": "Nay", "User Scrolled?": userHasScrolled});
        }}/>
        </View>
      </View>

    );
  }

}

import * as billsDB from './bills.json'
const BillsData = billsDB.data

const styles = StyleSheet.create({
  billdetailtitle: {
    fontWeight: 'bold',
    fontSize: 30,
    justifyContent: 'flex-start',
    textAlign: 'center',
    top: 30
  },
  billdetailbody: {
    fontSize: 15,
  },

})

const RootStack = createStackNavigator(
  {
    Splash: SplashScreen,
    Home: HomeScreen,
    BillDetail: BillsScreen,

  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
