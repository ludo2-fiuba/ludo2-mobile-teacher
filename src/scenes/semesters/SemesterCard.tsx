import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Semester } from '../../models/Semester';
import { useNavigation, useRoute } from '@react-navigation/native';
import { semesterRepository } from '../../repositories';
// import { semesterCard as style } from '../../styles';
import BasicList from '../../components/basicList';
import { parseEvaluationFromBackend } from '../../models/Evaluation';
import { lightModeColors } from '../../styles/colorPalette';

interface Props {
  route: any;
}

export function SemesterCard({ route }: Props) {
  const { commission } = route.params;
  console.log('From route params', commission);
  
  const [isLoading, setIsLoading] = useState(false);
  const [semester, setSemester] = useState<Semester | null>(null);
  const navigation = useNavigation();

  const listItems = [
    { name: "Ver Instancias de Examen", onPress: () => { 
      navigation.navigate('Evaluations', {
        semester: semester,
        evaluations: semester?.evaluations,
      });
    } },
    { name: "Cuerpo Docente", onPress: () => { 
      navigation.navigate('Teachers', {
        commissionId: commission.id, // Used to get the staff teachers
        chiefTeacher: semester?.commission.chiefTeacher, // pass the chief teacher from the semester
      });
    } },
    // {
    //   name: "Ver Correlativas", onPress: () => {
    //     navigation.navigate('CorrelativeSubjects', {
    //       id: semester.commission.subject_siu_id,
    //     });
    //   }
    // },
  ]

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const semesterData: Semester = await semesterRepository.fetchPresentSemesterFromCommissionId(commission.id);

      setSemester(semesterData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos conseguir información acerca del semestre. ' +
        'Volvé a intentar en unos minutos.',
      );
      setIsLoading(false);
    }
  }, [isLoading, commission.id]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusUnsubscribe;
  }, [navigation, fetchData]);

  if (isLoading) {
    return <View style={{ padding: 10, backgroundColor: 'black' }}><Text>Loading...</Text></View>;
  }

  if (!semester) {
    return <View style={{ padding: 10, backgroundColor: 'black' }}><Text>No data available</Text></View>;
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{commission.subject_name}</Text>
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
