/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'black',

  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  logotext: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  button: {

    alignItems: 'center',
    backgroundColor: 'rgba(156, 220, 221,0.5)',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 5,
  },
  postBox: {
    height: '40%',
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 5,
  },
  body: {
    paddingTop: 30,
    flex: 10,
    backgroundColor: '#353535',
  },
  bodyHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',

  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default class SinglePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PostText: [],
      postUser: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.ViewPost();
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

  ViewPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const post = JSON.parse(await AsyncStorage.getItem('@temp_post'));
    const id = await AsyncStorage.getItem('@temp_Id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/post/${post.post_id}`,
      {
        headers: {
          'X-Authorization': token,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthroised');
        } else if (response.status === 403) {
          throw new Error('can only view post of your friends');
        } else if (response.status === 404) {
          throw new Error('not Found');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          PostText: responseJson,
          postUser: responseJson.author,
          isLoading: false,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

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
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
          <TouchableOpacity style={styles.profileButton} />
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyHeading}>
            {this.state.postUser.first_name}
            {' '}
            {this.state.postUser.last_name}
            `s Post
          </Text>
          <View style={styles.postBox}>
            <Text>{this.state.PostText.text}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.text}>
              GoBack
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
