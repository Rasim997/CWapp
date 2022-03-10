/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
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
  textbox: {
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

export default class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPost: [],
      PostText: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.parsepost();
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

  updatePost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@temp_user');
    const toSend = {
      text: this.state.PostText,
    };

    if (this.state.PostText != null) {
      return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${this.state.currentPost.post_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          if (response.status === 200) {
            this.props.navigation.goBack();
          } else if (response.status === 401) {
            throw new Error('Unauthroised');
          } else if (response.status === 404) {
            throw new Error('Not Found');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          Error(error);
        });
    }
    throw new Error('Please make a change first');
  };

  parsepost = async () => {
    const post = JSON.parse(await AsyncStorage.getItem('@temp_post'));
    this.setState({ currentPost: post });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
          <TouchableOpacity style={styles.profileButton} />
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyHeading}>Edit Your Post</Text>
          <TextInput
            style={styles.textbox}
            multiline="true"
            maxLength={500}
            onChangeText={(PostText) => this.setState({ PostText })}
            defaultValue={this.state.currentPost.text}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.updatePost()}
          >
            <Text style={styles.text}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
