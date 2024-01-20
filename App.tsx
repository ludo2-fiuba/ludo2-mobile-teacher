import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  CameraTest,
  FinalExamsListScreen,
  FinalsListScreen,
  LandingScreen,
  PreRegisterLastInstructionsScreen,
  PreRegisterScreen,
  QRGeneratorScreen,
  RootDrawer,
  SemesterCard,
  SemesterList,
  SplashScreen,
  TakePictureStepScreen
} from './src/scenes';
import moment from 'moment';
import Evaluations from './src/scenes/evaluations/Evaluations';
import TeachersScreen from './src/scenes/teachers/Teachers';
import { AddEvaluation } from './src/scenes/finals';
import EvaluationGradesListTest from './src/scenes/evaluation/EvaluationGradesListTest';
import SubmissionsList from './src/scenes/evaluation/SubmissionsList';
import TeachersConfiguration from './src/scenes/teachers/TeachersConfiguration';
import AddTeachersConfigurationList from './src/scenes/teachers/AddTeachersConfigurationList';


interface SubjectParams {
  subject: { name: string };
}

interface EvaluationParams {
  evaluation: { evaluationName: string };
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

          {/** PRE-REGISTER */}
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

          {/* SEMESTERS */}

          {/* 
          <Stack.Screen
            name='SubjectsList'
            component={SemesterList}
            options={({ route }) => ({ title: 'Materias' })}
          /> */}

          <Stack.Screen
            name='SemesterCard'
            component={SemesterCard}
            options={({ route }) => ({ title: 'Semestre Actual' })}
          />

          {/* EVALUATIONS */}
          <Stack.Screen
            name="Evaluations"
            component={Evaluations}
            options={({ route }) => ({
              headerShown: true,
              title: "Evaluaciones",
            })}
          />
          <Stack.Screen
            name="AddEvaluation"
            component={AddEvaluation}
            options={({ route }) => ({
              headerShown: true,
              title: "Agregar instancia de evaluación",
            })}
          />

          {/* SUBMISSIONS */}
          <Stack.Screen
            name="SubmissionsList"
            component={SubmissionsList}
            options={({ route }) => ({
              headerShown: true,
              title: (route.params as EvaluationParams).evaluation.evaluationName,
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

          {/* TEACHERS */}
          <Stack.Screen
            name="Teachers"
            component={TeachersScreen}
            options={({ route }) => ({ title: 'Docentes' })}
          />

          <Stack.Screen
            name="TeachersConfiguration"
            component={TeachersConfiguration}
            options={({ route }) => ({ title: 'Configuracion de Semestre' })}
          />

          <Stack.Screen
            name="AddTeachersConfigurationList"
            component={AddTeachersConfigurationList}
            options={({ route }) => ({ title: 'Docentes en la comisión' })}
          />
          {/* CAMERA */}
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
            name="TakePicture"
            component={TakePictureStepScreen}
            options={({ route }) => ({ title: 'Tomar foto' })}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
