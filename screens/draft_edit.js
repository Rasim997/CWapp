/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput,
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

export default class DraftEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draft: [],
      allDrafts: [],
      textBox: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
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

  getData = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    const data1 = JSON.parse(await AsyncStorage.getItem('@Drafts'));
    this.setState({ draft: data, allDrafts: data1 });
  };

  updateDraft = async () => {
    const { draft, allDrafts, textBox } = this.state;
    const currentDraftId = draft.post_id;
    allDrafts[currentDraftId].text = textBox;
    await AsyncStorage.setItem('@Drafts', JSON.stringify(allDrafts));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logotext}> 𝓢𝓟𝓐𝓒𝓔𝓑𝓞𝓞𝓚 </Text>
          <TouchableOpacity style={styles.profileButton} />
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyHeading}>
            {`Draft NO: ${this.state.draft.post_id}`}
          </Text>
          <View style={styles.postBox}>
            <TextInput style={{ flex: 1 }} defaultValue={this.state.draft.text} multiline="true" placeholder="Draft Text" onChangeText={(textBox) => this.setState({ textBox })} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.updateDraft()}
          >
            <Text style={styles.text}>
              Edit Draft
            </Text>
          </TouchableOpacity>

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
