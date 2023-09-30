/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'moment/locale/es';
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import {
  CameraTest,
  FinalDateTimePickerScreen,
  FinalExamsListScreen,
  FinalsListScreen,
  HomeScreen,
  LandingScreen,
  PreRegisterLastInstructionsScreen,
  PreRegisterScreen,
  QRGeneratorScreen,
  SplashScreen,
  TakePictureStepScreen
} from './src/scenes';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
        <ActionSheetProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{gestureEnabled: false}}>
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{headerShown: false}}
              />
              
              <Stack.Screen
                name="CameraTest"
                component={CameraTest}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Landing"
                component={LandingScreen}
                options={{headerShown: false, title: 'Inicio'}}
              />

              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="PreRegister"
                component={PreRegisterScreen}
                options={{headerShown: true, title: 'Pre-registro'}}
              />

              <Stack.Screen
                name="PreRegisterDone"
                component={PreRegisterLastInstructionsScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="TakePicture"
                component={TakePictureStepScreen}
                options={({route}) => ({title: route.params.title})}
              />

              <Stack.Screen
                name="FinalsList"
                component={FinalsListScreen}
                options={({route}) => ({
                  headerShown: true,
                  title: route.params.subject.name,
                })}
              />
              <Stack.Screen
                name="FinalDateTimePicker"
                component={FinalDateTimePickerScreen}
                options={({route}) => ({
                  headerShown: true,
                  title: route.params.subject.name,
                })}
              />
              <Stack.Screen
                name="QR"
                component={QRGeneratorScreen}
                options={({route}) => ({
                  headerShown: true,
                  title: moment(route.params.final.date).format(
                    'dd/MM/YYYY HH:mm',
                  ),
                })}
              />
              <Stack.Screen
                name="FinalExamsList"
                component={FinalExamsListScreen}
                options={({route}) => ({
                  headerShown: true,
                  title: moment(route.params.final.date).format(
                    'DD/MM/YYYY HH:mm',
                  ),
                })} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ActionSheetProvider>
    );
  }
}
