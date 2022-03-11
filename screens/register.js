/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, TextInput, StyleSheet, SafeAreaView,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBox: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 50,
    color: '#0e4671',

  },
  body: {
    flex: 3,
    marginHorizontal: 20,

  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#9cdcdd',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 5,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#9cdcdd',
  },
  textInput: {
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: '#cccccc',
    marginVertical: 5,

  },
});

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName: '',
      stateEmail: '',
      statePassword: '',
      passwordError: '',

    };
  }

  register = async () => {
    const {
      fName,
      lName,
      stateEmail,
      statePassword,
    } = this.state;

    const toSend = {
      first_name: fName,
      last_name: lName,
      email: stateEmail,
      password: statePassword,
    };

    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('Login');
          return response.json();
        } if (response.status === 400) {
          throw new Error('Invalid stateEmail or statePassword');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  checkPassword() {
    if (this.state.statePassword.length >= 5) {
      this.setState({ passwordError: '' });
    } else {
      this.setState({ passwordError: 'Password should be atleast 6 characters' });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Register</Text>
        </View>
        <View style={styles.body}>
          <TextInput style={styles.textInput} maxLength={50} placeholder=" First Name" onChangeText={(fName) => this.setState({ fName })} />
          <TextInput style={styles.textInput} maxLength={50} placeholder=" Last Name" onChangeText={(lName) => this.setState({ lName })} />
          <TextInput style={styles.textInput} maxLength={62} placeholder=" Email" onChangeText={(stateEmail) => this.setState({ stateEmail })} />
          <TextInput style={styles.textInput} placeholder=" Password" onBlur={() => this.checkPassword()} onChangeText={(statePassword) => this.setState({ statePassword })} secureTextEntry />
          <Text style={{ color: 'red' }}>{this.state.passwordError}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.register()}
          >
            <Text style={styles.text}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.text}>
              Back To Login
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}
