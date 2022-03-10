/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
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
  },
  objectText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  postBody: {
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  icons: {
    width: 20,
    margin: 5,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  iconsText: {
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default class Drafts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftData: [],
      userId: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getdata();
    });
    this.getdata();
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

  getdata = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('@Drafts'));
    const id = await AsyncStorage.getItem('@session_id');
    this.setState({ draftData: data, userId: id });
  };

  removeDraft = async (draftId) => {
    const data = JSON.parse(await AsyncStorage.getItem('@Drafts'));
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const TExt = data[i].text;
      const UserId = data[i].user_id;
      const Time = data[i].time;
      const PostId = data[i].post_id;

      if (PostId !== draftId) {
        newData.push({
          text: TExt, user_id: UserId, time: Time, post_id: PostId,
        });
      }
    }
    await AsyncStorage.setItem('@Drafts', JSON.stringify(newData));
    this.getdata();
  };

  postDraft = async (post) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@temp_user');
    const toSend = {
      text: post.text,
    };
    return fetch(`http://localhost:3333/api/1.0.0/user/ ${id} /post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 201) {
          this.removeDraft(post.post_id);
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
  };

  dispDraft(post) {
    if (post.user_id == this.state.userId) {
      const time = new Date(post.time);
      return (
        <View style={styles.postBody}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Draft saved on:
              {` ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} `}
              {`${time.getHours()}:${time.getMinutes()}`}
            </Text>
          </View>
          <Text>{post.text}</Text>
          <View style={{ borderWidth: 1 }} />

          <View
            style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}
          >
            <TouchableOpacity
              style={styles.icons}
              onPress={() => this.postDraft(post)}
            >
              <Text style={styles.iconsText}>📫</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icons}
              onPress={async () => { await AsyncStorage.setItem('@draftPost', JSON.stringify(post)); this.props.navigation.navigate('DraftEdit'); }}
            >
              <Text style={styles.iconsText}>♻️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icons}
              onPress={() => this.removeDraft(post.post_id)}
            >
              <Text style={styles.iconsText}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (null);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ alignSelf: 'center' }}><Text style={{ fontSize: 40, alignSelf: 'center' }}>🔙</Text></TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.objectText}>Drafts</Text>
          <FlatList
            style={{
              flex: 1,
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 5,
            }}
            data={this.state.draftData}
            renderItem={({ item }) => (this.dispDraft(item))}
            keyExtractor={(item) => item.time.toString()}
          />
        </View>
      </View>
    );
  }
}
