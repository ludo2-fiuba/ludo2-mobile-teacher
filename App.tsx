import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  CameraTest,
  FinalDateTimePickerScreen,
  FinalExamsListScreen,
  FinalsListScreen,
  LandingScreen,
  PreRegisterLastInstructionsScreen,
  PreRegisterScreen,
  QRGeneratorScreen,
  RootDrawer,
  SplashScreen,
  TakePictureStepScreen
} from './src/scenes';
import moment from 'moment';

interface TakePictureParams {
  title: string;
}

interface SubjectParams {
  subject: { name: string };
}

interface FinalParams {
  final: { date: Date };
}

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ gestureEnabled: false }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false, title: 'Inicio' }}
          />

          <Stack.Screen
            name="RootDrawer"
            component={RootDrawer}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CameraTest"
            component={CameraTest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PreRegister"
            component={PreRegisterScreen}
            options={{ headerShown: true, title: 'Pre-registro' }}
          />

          <Stack.Screen
            name="PreRegisterDone"
            component={PreRegisterLastInstructionsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TakePicture"
            component={TakePictureStepScreen}
            options={({ route }) => ({ title: 'Tomar foto' })}
          />

          <Stack.Screen
            name="FinalsList"
            component={FinalsListScreen}
            options={({ route }) => ({
              headerShown: true,
              title: (route.params as SubjectParams)?.subject.name,
            })}
          />
          <Stack.Screen
            name="FinalDateTimePicker"
            component={FinalDateTimePickerScreen}
            options={({ route }) => ({
              headerShown: true,
              title: (route.params as SubjectParams)?.subject.name,
            })}
          />
          <Stack.Screen
            name="QR"
            component={QRGeneratorScreen}
            options={({ route }) => ({
              headerShown: true,
              title: moment((route.params as FinalParams)?.final.date).format(
                'dd/MM/YYYY HH:mm',
              ),
            })}
          />
          <Stack.Screen
            name="FinalExamsList"
            component={FinalExamsListScreen}
            options={({ route }) => ({
              headerShown: true,
              title: moment((route.params as FinalParams)?.final.date).format(
                'DD/MM/YYYY HH:mm',
              ),
            })}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
