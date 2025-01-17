/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  postBody: {
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  bodyHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      photo: null,
      userId: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.getPost();
      this.getProfileImage();
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

  getProfileImage = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
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

  getPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
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
          post: responseJson,
          userId: id,
          isLoading: false,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  likepost = async (postid) => {
    const userId = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${postid}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server Error');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  unlikepost = async (postid) => {
    const userId = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${postid}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server Error');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  deletePost = async (postid) => {
    const userId = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${postid}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server Error');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  dispPost(post) {
    const lastName = post.author.last_name;
    const firstName = post.author.first_name;
    const userid = this.state.userId;

    if (userid == post.author.user_id) {
      return (
        <View style={styles.postBody}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {firstName}
              {lastName}
            </Text>
          </View>
          <Text>{post.text}</Text>
          <View style={{ borderWidth: 1 }} />

          <View
            style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}
          >
            <Text style={{ alignSelf: 'center', marginHorizontal: 5 }}>{post.numLikes}</Text>

            <View style={{ height: '100%', borderWidth: 1, marginLeft: 10 }} />

            <TouchableOpacity style={styles.icons}>
              <Text
                style={styles.iconsText}
                onPress={() => this.props.navigation.navigate('Profile')}
              >
                🧑
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icons}
              onPress={async () => {
                await AsyncStorage.setItem('@temp_post', JSON.stringify(post)),
                await AsyncStorage.setItem('@temp_Id', userid),
                this.props.navigation.navigate('SinglePost');
              }}
            >
              <Text style={styles.iconsText}>📖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icons}
              onPress={async () => {
                await AsyncStorage.setItem('@temp_user', userid),
                await AsyncStorage.setItem('@temp_post', JSON.stringify(post)),
                this.props.navigation.navigate('Edit_post');
              }}
            >
              <Text style={styles.iconsText}>♻️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icons}
              onPress={() => {
                this.deletePost(post.post_id), this.getPost();
              }}
            >
              <Text style={styles.iconsText}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.postBody}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {firstName}
              {lastName}
            </Text>
          </View>
          <Text>{post.text}</Text>

          <View style={{ borderWidth: 1 }} />

          <View
            style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}
          >
            <TouchableOpacity
              style={{ width: 25, margin: 5 }}
              onPress={() => this.unlikepost(post.post_id)}
            >
              <Text
                style={{ color: 'black', fontSize: 25, alignSelf: 'center' }}
              >
                ♥
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 25, margin: 5 }}
              onPress={() => this.likepost(post.post_id)}
            >
              <Text style={{ color: 'red', fontSize: 25, alignSelf: 'center' }}>
                ♥
              </Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', marginHorizontal: 5 }}>
              {post.numLikes}
            </Text>

            <View style={{ height: '100%', borderWidth: 1, marginLeft: 10 }} />

            <TouchableOpacity
              style={styles.icons}
              onPress={async () => {
                await AsyncStorage.setItem('@temp_post', JSON.stringify(post)),
                await AsyncStorage.setItem('@temp_Id', userid),
                this.props.navigation.navigate('SinglePost');
              }}
            >
              <Text style={styles.iconsText}>📖</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
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
    const spacebooklogo = '𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}>
            {spacebooklogo}
          </Text>
          <TouchableOpacity>
            <Image
              source={{ uri: this.state.photo }}
              style={{ width: 60, height: '100%', borderWidth: 5 }}
              onClick={() => this.props.navigation.navigate('Profile')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 20,
            }}
          >
            <Text style={styles.bodyHeading}>𝓟𝓸𝓼𝓽𝓼</Text>
            <TouchableOpacity>
              <Text
                style={styles.bodyHeading}
                onClick={async () => {
                  await AsyncStorage.setItem('@temp_user', this.state.userId),
                  this.props.navigation.navigate('Add_Post');
                }}
              >
                ➕
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              padding: 2,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 5,
              marginBottom: 5,
            }}
          />

          <FlatList
            data={this.state.post}
            renderItem={({ item }) => this.dispPost(item)}
            keyExtractor={(item) => item.post_id.toString()}
          />
        </View>
      </SafeAreaView>
    );
  }
}
