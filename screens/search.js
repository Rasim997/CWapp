/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator,
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
    fontSize: 20,
  },
});

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      searchq: '',
      searchOffset: 0,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData(this.state.searchOffset);
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

  getData = async (offset) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/search/?q=${this.state.searchq}&limit=9&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Bad Request');
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Server error');
        }
      })
      .then((responseJson) => {
        this.setState({
          people: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  AddFriend = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/friends`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
      },
    )
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('BadRequest');
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('User Already A friend');
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

  person(person) {
    return (
      <View style={styles.personBody}>
        <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>
          {' '}
          🧑
          {' '}
          {person.user_givenname}
          {' '}
          {person.user_familyname}
        </Text>
        <TouchableOpacity onPress={() => this.AddFriend(person.user_id)}><Text style={{ color: 'green', fontSize: 25 }}>➕</Text></TouchableOpacity>
      </View>

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
          <View style={{
            flexDirection: 'row', width: '95%', height: 40, alignSelf: 'center',
          }}
          >
            <TextInput placeholder="Enter a Name" style={{ flex: 1, backgroundColor: 'white', borderRadius: 5 }} onChangeText={(searchq) => this.setState({ searchq })} />
            <TouchableOpacity
              onPress={() => this.getData()}
            >
              <Text style={{ fontSize: 30 }}>
                🔍
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.people}
            renderItem={({ item }) => (this.person(item))}
            keyExtractor={(item) => item.user_id.toString()}

          />
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginBottom: 8 }}>
            <TouchableOpacity style={{ backgroundColor: 'rgba(156, 220, 221,0.5)', marginHorizontal: 5, padding: 5, paddingHorizontal: 15, borderRadius: 5 }} onPress={() => { if (this.state.people.length > 0) { this.state.searchOffset += 9; } this.getData(this.state.searchOffset); }}>
              <Text>Next Page</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'rgba(156, 220, 221,0.5)', marginHorizontal: 5, padding: 5, borderRadius: 5 }} onPress={() => { if (this.state.searchOffset > 0) { this.state.searchOffset -= 9; } this.getData(this.state.searchOffset); }}>
              <Text>Previous Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
