import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  LandingScreen,
  PreRegisterLastInstructionsScreen,
  PreRegisterScreen,
  RootDrawer,
  SemesterCard,
  SplashScreen,
  StatsScreen,
  TakePictureStepScreen
} from './src/scenes';
import moment from 'moment';
import EvaluationsList from './src/scenes/evaluations/EvaluationsList';
import TeachersScreen from './src/scenes/teachers/Teachers';
import { AddEvaluation, FinalsList } from './src/scenes/finals';
import SubmissionsList from './src/scenes/evaluation/SubmissionsList';
import TeachersConfiguration from './src/scenes/teachers/TeachersConfiguration';
import AddTeachersConfigurationList from './src/scenes/teachers/AddTeachersConfigurationList';
import { Provider } from 'react-redux';
import { store } from './src/store';
import SemesterStudents from './src/scenes/semesters/SemesterStudents';
import SemesterAttendanceQR from './src/scenes/qr_generator/AttendanceQR';
import FinalExamQR from './src/scenes/qr_generator/FinalExamQR';
import FinalExamSubmissions from './src/scenes/finalExamsSubmissions/FinalExamSubmissions';
import AddFinal from './src/scenes/finals/AddFinal';
import SemesterAttendances from './src/scenes/attendances/SemesterAttendances';
import AttendanceDetails from './src/scenes/attendances/AttendanceDetails';
import SemesterEditScreen from './src/scenes/semesters/SemesterEditScreen';
import EvaluationQR from './src/scenes/qr_generator/EvaluationQR';


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

const App = () => (
  <Provider store={store}>
    <AllComponents />
  </Provider>
);


const AllComponents: React.FC = () => {
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
          <Stack.Screen
            name='SemesterCard'
            component={SemesterCard}
            options={({ route }) => ({ title: 'Semestre Actual' })}
          />

          <Stack.Screen
            name='SemesterStudents'
            component={SemesterStudents}
            options={({ route }) => ({ title: 'Estudiantes del semestre' })}
          />

          <Stack.Screen
            name='SemesterEditScreen'
            component={SemesterEditScreen}
            options={({ route }) => ({ title: 'Editar semestre' })}
          />




          {/* EVALUATIONS */}
          <Stack.Screen
            name="EvaluationsList"
            component={EvaluationsList}
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

          {/* FINALS */}
          <Stack.Screen
            name="FinalsList"
            component={FinalsList}
            options={({ route }) => ({
              headerShown: true,
              title: 'Finales',
            })}
          />

          <Stack.Screen
            name="AddFinal"
            component={AddFinal}
            options={({ route }) => ({
              headerShown: true,
              title: "Agregar instancia de final",
            })}
          />

          <Stack.Screen
            name="FinalExamSubmissions"
            component={FinalExamSubmissions}
            options={({ route }) => ({
              headerShown: true,
              title: 'Entregas del final',
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
            name="FinalExamQR"
            component={FinalExamQR}
            options={({ route }) => ({
              headerShown: true,
              title: moment((route.params as FinalParams)?.final.date).format(
                'dd/MM/YYYY HH:mm',
              ),
            })}
          />

          {/* Attendances */}
          <Stack.Screen
            name="SemesterAttendances"
            component={SemesterAttendances}
            options={({ route }) => ({
              headerShown: true,
              title: 'Asistencias del semestre',
            })}
          />



          <Stack.Screen
            name="AttendanceDetails"
            component={AttendanceDetails}
            options={({ route }) => ({
              headerShown: true,
              title: 'Detalles de la clase',
            })}
          />

          <Stack.Screen
            name="SemesterAttendanceQR"
            component={SemesterAttendanceQR}
            options={{
              headerShown: true,
              title: 'QR de Asistencias',
            }}
          />

          <Stack.Screen
            name="EvaluationQR"
            component={EvaluationQR}
            options={{
              headerShown: true,
              title: 'QR de Evaluación',
            }}
          />

          <Stack.Screen
            name="TakePicture"
            component={TakePictureStepScreen}
            options={({ route }) => ({ title: 'Tomar foto' })}
          />

          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={({ route }) => ({ title: 'Estadísticas' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
