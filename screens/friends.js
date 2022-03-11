/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353535',
  },
  header: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    padding: 10,
  },
  logotext: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  body: {
    paddingTop: 10,
    flex: 10,
    backgroundColor: '#353535',
  },

  topBody: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255,0.5)',
    borderRadius: 10,
    borderColor: 'black',
    margin: 10,
    padding: 5,
  },
  divider: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  bottomBody: {
    flex: 3,
    backgroundColor: 'rgba(255, 255, 255,0.5)',
    borderRadius: 10,
    borderColor: 'black',
    margin: 10,
    padding: 5,
  },
  personBody: {
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  objectText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',

  },
});

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Ofr: [],
      friend_list: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.GetOustandingFriends();
      this.getFriendsList();
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.refresh();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  Acceptfr = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: { 'X-Authorization': token },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendsList();
          this.GetOustandingFriends();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  Rejectfr = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: { 'X-Authorization': token },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendsList();
          this.GetOustandingFriends();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  GetOustandingFriends = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      headers: { 'X-Authorization': token },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          Ofr: responseJson,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  getFriendsList = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      headers: { 'X-Authorization': token },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Can only view the friends of yourself or your friends');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          friend_list: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  person(person) {
    return (
      <View style={styles.personBody}>
        <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>
          🧑
          {person.first_name}
          {person.last_name}
        </Text>
        <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { this.Acceptfr(person.user_id); }}><Text style={{ color: 'green', fontSize: 25 }}>✅</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.Rejectfr(person.user_id); }}><Text style={{ color: 'red', fontSize: 25 }}>❎</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  friendslist(person) {
    return (
      <TouchableOpacity style={styles.personBody} onPress={async () => { await AsyncStorage.setItem('@temp_Id', JSON.stringify(person.user_id)), await AsyncStorage.setItem('@temp_user', JSON.stringify(person.user_id)), this.props.navigation.navigate('FriendPosts'); }}>
        <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>
          🧑
          {person.user_givenname}
          {person.user_familyname}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚  </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.topBody}>
            <Text style={styles.objectText}>Outstanding Friend Requests</Text>
            <FlatList
              data={this.state.Ofr}
              renderItem={({ item }) => (this.person(item))}
              keyExtractor={(item) => item.user_id.toString()}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomBody}>
            <Text style={styles.objectText}>Friends</Text>
            <FlatList
              data={this.state.friend_list}
              renderItem={({ item }) => (this.friendslist(item))}
              keyExtractor={(item) => item.user_id.toString()}
            />
          </View>

        </View>
      </SafeAreaView>

    );
  }
}
