import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { Semester } from '../../models/Semester';
import { useNavigation, useRoute } from '@react-navigation/native';
import { semesterRepository } from '../../repositories';
// import { semesterCard as style } from '../../styles';
import BasicList from '../../components/basicList';
import { lightModeColors } from '../../styles/colorPalette';
import { fetchSemesterDataAsync, selectSemesterData, selectSemesterError, selectSemesterLoading } from '../../features/semesterSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Commission } from '../../models';
import MaterialIcon from '../../components/MaterialIcon';
import { fetchTeachers } from '../../features/teachersSlice';

interface Props {
  route: any;
}

interface RouteParams {
  commission: Commission;
}

export function SemesterCard({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const commission = (route.params as RouteParams).commission;
  console.log("Commission", commission);
  
  const semesterData = useAppSelector(selectSemesterData);
  const isLoading = useAppSelector(selectSemesterLoading);
  const error = useAppSelector(selectSemesterError);

  const listItems = [
    {
      name: "Ver Instancias de Examen", onPress: () => {
        navigation.navigate('EvaluationsList', {
          semester: semesterData,
          evaluations: semesterData?.evaluations,
        });
      },
      materialIcon: <MaterialIcon name="note-multiple" fontSize={24} />
    },
    {
      name: "Ver Instancias de Final", onPress: () => {
        navigation.navigate('FinalsList', {
          subjectId: commission.subjectSiuId,
          subjectName: commission.subjectName
        });
      },
      materialIcon: <MaterialIcon name="book-variant" fontSize={24} />
    },
    {
      name: "Cuerpo Docente", onPress: () => {
        navigation.navigate('Teachers', {
          commissionId: commission.id, // Used to get the staff teachers
          chiefTeacher: semesterData?.commission.chiefTeacher, // pass the chief teacher from the semester
        });
      },
      materialIcon: <MaterialIcon name="account-tie" fontSize={24} />
    },
    {
      name: "Ver Alumnos", onPress: () => {
        navigation.navigate('SemesterStudents', {
          commission: commission,
          semester: semesterData,
        });
      },
      materialIcon: <MaterialIcon name="account-group" fontSize={24} />
    },
    {
      name: "Ver asistencias por fecha", onPress: () => {
        navigation.navigate('SemesterAttendances', {
          semester: semesterData,
        });
      },
      materialIcon: <MaterialIcon name="account-check" fontSize={24} />
    },
    {
      name: "Estadísticas", onPress: () => {
        navigation.navigate('Stats', {
          semester: semesterData,
        });
      },
      materialIcon: <MaterialIcon name="chart-box" fontSize={24} />
    }
    // {
    //   name: "Ver Correlativas", onPress: () => {
    //     navigation.navigate('CorrelativeSubjects', {
    //       id: semester.commission.subject_siu_id,
    //     });
    //   }
    // },
  ]

  useEffect(() => {
    dispatch(fetchSemesterDataAsync(commission.id));
    dispatch(fetchTeachers(commission.id))
  }, [dispatch, commission]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error',
        'No se pudo cargar la información del semestre. Intente nuevamente más tarde.'
      );
    }
  }, [error]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={lightModeColors.institutional} />
      </View>
    );
  }

  if (!semesterData) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No hay datos disponibles</Text></View>;
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{commission.subjectName}</Text>
      <Text style={styles.header2}>{commission.chiefTeacher.firstName} {commission.chiefTeacher.lastName}</Text>
      <View style={styles.card}>
        <View style={styles.cardItem}>
          <BasicList items={listItems} />
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 20,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    gap: 18
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  cardText: {
    color: 'gray',
  },
  passingGradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightModeColors.institutional,
  },
  passingGradeLabel: {
    fontSize: 14,
    color: 'gray',
  },
});
