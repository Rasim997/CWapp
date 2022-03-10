/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
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
    alignItems: 'center',
  },
  profileimg: {
    borderWidth: 5,
    borderRadius: 20,
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(156, 220, 221,0.5)',
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  userInfo: {
    width: '95%',
    height: 120,
    flexDirection: 'row',
    backgroundColor: 'rgba(100,100,100,0.8)',
    padding: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  userNameText: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'bold',
  },
  userInfoText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'bold',
  },
  textInput: {
    fontSize: 15,
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: '#cccccc',
    marginVertical: 5,
    padding: 10,
  },
});

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,

      userFName: '',
      userLName: '',
      userEmail: '',
      user_friendCount: 0,
      userPassword: '',

      newFName: '',
      newLName: '',
      newEmail: '',
      newPassword: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.get_profile_image();
      this.getDetails();
      this.checkLoggedIn();
    });
    this.get_profile_image();
    this.getDetails();

    const {
      userFName, userLName, UserEmail, userPassword,
    } = this.state;

    this.setState({
      newFName: userFName,
      newLName: userLName,
      newEmail: UserEmail,
      newPassword: userPassword,
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

  get_profile_image = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
        });
      })
      .catch((err) => {
        Error('error', err);
      });
  };

  getDetails = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server error');
        }
      })
      .then((responseJson) => {
        this.setState({
          userFName: responseJson.first_name,
          userLName: responseJson.last_name,
          userEmail: responseJson.email,
          user_friendCount: responseJson.friend_count,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  changeDetails = async () => {
    const toSend = {
      first_name: this.state.newFName,
      last_name: this.state.newLName,
      email: this.state.newEmail,
      password: this.state.newPassword,
    };
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          this.getDetails();
        } else if (response.status === 400) {
          throw new Error('Bad Request');
        } else if (response.status === 401) {
          throw new Error('Unauthroised');
        } else if (response.status === 403) {
          throw new Error('Forbidden');
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

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    await AsyncStorage.clear();
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Server Error');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: this.state.photo }}
              style={styles.profileimg}
            />
            <View style={{ flex: 3 }}>
              <Text style={styles.userNameText}>
                {this.state.userFName}
                {' '}
                {this.state.userLName}
              </Text>
              <Text style={styles.userInfoText}>
                Email:
                {' '}
                {this.state.userEmail}
              </Text>
              <Text style={styles.userInfoText}>
                Friends:
                {' '}
                {this.state.user_friendCount}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Camera')}
          >
            <Text style={styles.text}>Edit Photo</Text>
          </TouchableOpacity>

          <View style={{ flex: 2, width: '95%' }}>
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.userFName}
              onChangeText={(newFName) => this.setState({ newFName })}
            />
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.userLName}
              onChangeText={(newLName) => this.setState({ newLName })}
            />
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.userEmail}
              onChangeText={(newEmail) => this.setState({ newEmail })}
            />
            <TextInput
              style={styles.textInput}
              placeholder=" Password"
              onChangeText={(newPassword) => this.setState({ newPassword })}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.changeDetails()}
            >
              <Text style={styles.text}>Change Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.logout()}
            >
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.text}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
