import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, Route } from '@react-navigation/native';
import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
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
import moment from 'moment';
import { SessionManager } from './src/managers';
import { ProfileOverview } from './src/components';

interface TakePictureParams {
  title: string;
}

interface SubjectParams {
  subject: { name: string };
}

interface FinalParams {
  final: { date: Date };
}

const Drawer = createDrawerNavigator();


const DRAWER_MENU_SHOWN_SCREENS = [
  "Home",
  "InCourseSubjects",
  "PendingSubjects",
  "ApprovedSubjects",
  "DeliverFinalExam",
  "VerifyIdentity"
]

const FilteredDrawerContent = (props: DrawerContentComponentProps<DrawerContentOptions>) => {
  const { state, ...rest } = props;
  const newState = {
    ...state, routes: state.routes.filter((route: any) => {
      return DRAWER_MENU_SHOWN_SCREENS.includes(route.name);
    })
  };

  return (
    <DrawerContentScrollView {...props}>
      <ProfileOverview />
      <DrawerItemList {...rest} state={newState} />
      <DrawerItem label="Cerrar Sesión" onPress={async () => {
        await SessionManager.getInstance()?.clearCredentials();
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        })
      }} />
    </DrawerContentScrollView>
  );
}

const App: React.FC = () => {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Landing"
          // screenOptions={{ headerTintColor: colors.mainContrastColor }}
          drawerContent={props => <FilteredDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false, title: 'Inicio' }}
          />

          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: true }}
          />

          <Drawer.Screen
            name="CameraTest"
            component={CameraTest}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="PreRegister"
            component={PreRegisterScreen}
            options={{ headerShown: true, title: 'Pre-registro' }}
          />

          <Drawer.Screen
            name="PreRegisterDone"
            component={PreRegisterLastInstructionsScreen}
            options={{ headerShown: false }}
          />

          <Drawer.Screen
            name="TakePicture"
            component={TakePictureStepScreen}
            options={({ route }) => ({ title: 'Tomar foto' })}
          />

          <Drawer.Screen
            name="FinalsList"
            component={FinalsListScreen}
            options={({ route }) => ({
              headerShown: true,
              title: (route.params as SubjectParams)?.subject.name,
            })}
          />
          <Drawer.Screen
            name="FinalDateTimePicker"
            component={FinalDateTimePickerScreen}
            options={({ route }) => ({
              headerShown: true,
              title: (route.params as SubjectParams)?.subject.name,
            })}
          />
          <Drawer.Screen
            name="QR"
            component={QRGeneratorScreen}
            options={({ route }) => ({
              headerShown: true,
              title: moment((route.params as FinalParams)?.final.date).format(
                'dd/MM/YYYY HH:mm',
              ),
            })}
          />
          <Drawer.Screen
            name="FinalExamsList"
            component={FinalExamsListScreen}
            options={({ route }) => ({
              headerShown: true,
              title: moment((route.params as FinalParams)?.final.date).format(
                'DD/MM/YYYY HH:mm',
              ),
            })}
          />

        </Drawer.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
