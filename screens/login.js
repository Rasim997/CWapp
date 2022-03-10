/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import imBackground from '../assets/LoginBackground.gif';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBox: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    color: 'white',

  },
  body: {
    flex: 1,
    marginHorizontal: 20,

  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(156, 220, 221,0.5)',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 5,
  },
  textInput: {
    borderColor: 'black',
    borderRadius: 5,
    margin: 5,
    padding: 10,
    opacity: 23,
    backgroundColor: 'white',

  },
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StateEmail: '',
      StatePassword: '',
      passwordError: '',
      emailError: '',
    };
  }

  login = async () => {
    const { StateEmail, StatePassword } = this.state;
    const toSend = {
      email: StateEmail,
      password: StatePassword,
    };
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        await AsyncStorage.setItem('@session_id', JSON.stringify(responseJson.id));
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate('Main');
      })
      .catch((error) => {
        Error(error);
      });
  };

  checkEmail() {
    if (this.state.StateEmail.toLowerCase().length <= 6) {
      this.setState({ emailError: 'Email is not valid' });
    } else {
      this.setState({ emailError: '' });
    }
  }

  checkPassword() {
    if (this.state.StatePassword.length >= 5) {
      this.setState({ passwordError: '' });
    } else {
      this.setState({ passwordError: 'Password should be atleast 6 characters' });
    }
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
      <View style={styles.container}>
        <ImageBackground style={styles.container} source={imBackground} resizeMod="cover">
          <View style={styles.titleBox}>
            <Text style={styles.title}>𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚</Text>
          </View>
          <View style={styles.body}>
            <TextInput style={styles.textInput} placeholder="Email" onBlur={() => this.checkEmail()} onChangeText={(StateEmail) => this.setState({ StateEmail })} />
            <Text style={{ color: 'red' }}>{this.state.emailError}</Text>
            <TextInput style={styles.textInput} placeholder="Password" secureTextEntry onBlur={() => this.checkPassword()} onChangeText={(StatePassword) => { this.setState({ StatePassword }); this.checkPassword(); }} value={this.state.StatePassword} />
            <Text style={{ color: 'red' }}>{this.state.passwordError}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.login()}
            >
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', fontSize: 12 }}>OR</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Register')}
            >
              <Text style={styles.text}>Register</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
