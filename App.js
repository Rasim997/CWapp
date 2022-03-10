/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import Login from './screens/login';
import Register from './screens/register';
import Home from './screens/home';

import Search from './screens/search';
import Camera from './screens/camera';
import AddPost from './screens/add_post';
import Friends from './screens/friends';
import Profile from './screens/profile';
import SinglePost from './screens/single_post';
import EditPost from './screens/edit_post';
import FriendPosts from './screens/friend_posts';
import Drafts from './screens/drafts';
import DraftEdit from './screens/draft_edit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 25 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 25 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 25, color: 'blue' }}>👥</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Add_Post" component={AddPost} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="SinglePost" component={SinglePost} />
        <Stack.Screen name="Edit_post" component={EditPost} />
        <Stack.Screen name="FriendPosts" component={FriendPosts} />
        <Stack.Screen name="Drafts" component={Drafts} />
        <Stack.Screen name="DraftEdit" component={DraftEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
