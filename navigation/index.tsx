import React from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screens
import Home from '../screens/Home';
import DetailScreen from '../screens/DetailScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
//Utils
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigation />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigation () {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen 
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DetailScreen"
          component={DetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}
