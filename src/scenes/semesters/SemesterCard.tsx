import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Semester } from '../../models/Semester';
import { useNavigation, useRoute } from '@react-navigation/native';
import { semesterRepository } from '../../repositories';
// import { semesterCard as style } from '../../styles';
import BasicList from '../../components/basicList';
import { lightModeColors } from '../../styles/colorPalette';
import { fetchSemesterDataAsync } from '../../features/semesterSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Commission } from '../../models';

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
  const semesterData = useAppSelector((state) => state.semester.data);
  const isLoading = useAppSelector((state) => state.semester.loading);
  const error = useAppSelector((state) => state.semester.error);

  const listItems = [
    {
      name: "Ver Instancias de Examen", onPress: () => {
        navigation.navigate('Evaluations', {
          semester: semesterData,
          evaluations: semesterData?.evaluations,
        });
      }
    },
    {
      name: "Ver Instancias de Final", onPress: () => {
        navigation.navigate('Evaluations', {
          semester: semesterData,
          evaluations: semesterData?.evaluations,
        });
      }
    },
    {
      name: "Cuerpo Docente", onPress: () => {
        navigation.navigate('Teachers', {
          commissionId: commission.id, // Used to get the staff teachers
          chiefTeacher: semesterData?.commission.chiefTeacher, // pass the chief teacher from the semester
        });
      }
    },
    {
      name: "Ver Alumnos", onPress: () => {
        navigation.navigate('SemesterStudents', {
          commission: commission,
          semester: semesterData,
        });
      }
    },
    {
      name: "Generar QR de Asistencias", onPress: () => {
        navigation.navigate('QRAttendance', {
          semester: semesterData,
        });
      }
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
    marginBottom: 10,
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
