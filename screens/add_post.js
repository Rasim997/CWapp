/* eslint-disable eqeqeq */
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
    fontFamily: 'lucida grande',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default class AddPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PostText: '',
      inputError: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.refresh();
  }

  Post = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@temp_user');
    const { PostText } = this.state;
    const toSend = {
      text: PostText,
    };

    if (PostText != '') {
      this.setState({ inputError: '' });
      return fetch(`http://localhost:3333/api/1.0.0/user/ ${id} /post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Connection: 'Keep-Alive',
          'X-Authorization': token,
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          if (response.status === 201) {
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
          throw new Error(error);
        });
    }
    this.setState({ inputError: 'Please Type Something before submitting' });
    return null;
  };

  saveDraft = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const datain = JSON.parse(await AsyncStorage.getItem('@Drafts'));
    const dateAndTime = Date.now();

    if (datain != null) {
      const draftId = datain.length;
      const tostore = {
        text: this.state.PostText,
        user_id: id,
        time: dateAndTime,
        post_id: draftId,
      };

      datain.push(tostore);
      await AsyncStorage.setItem('@Drafts', JSON.stringify(datain));
    } else {
      const data = [{
        text: this.state.PostText,
        user_id: id,
        time: dateAndTime,
        post_id: 0,
      }];
      await AsyncStorage.setItem('@Drafts', JSON.stringify(data));
    }
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
          <TouchableOpacity style={styles.profileButton} />
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyHeading}>Whats on your mind?</Text>
          <TextInput
            style={styles.textbox}
            multiline="true"
            maxLength={500}
            placeholder="Type your post here..."
            onChangeText={(PostText) => this.setState({ PostText })}
          />
          <Text style={{ color: 'red', alignSelf: 'center' }}>{this.state.inputError}</Text>
          <TouchableOpacity style={styles.button} onPress={() => this.Post()}>
            <Text style={styles.text}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.saveDraft()}
          >
            <Text style={styles.text}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Drafts')}
          >
            <Text style={styles.text}>View Drafts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.text}>GoBack</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
