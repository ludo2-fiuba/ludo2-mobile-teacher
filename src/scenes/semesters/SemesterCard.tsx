import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Semester } from '../../models/Semester';
import { useNavigation, useRoute } from '@react-navigation/native';
import { semesterRepository } from '../../repositories';
import { semesterCard as style } from '../../styles';
import BasicList from '../../components/basicList';
import { parseEvaluationFromBackend } from '../../models/Evaluation';

interface Props {
  route: any;
}

export function SemesterCard({ route }: Props) {
  const { commissionId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [semester, setSemester] = useState<Semester | null>(null);
  const navigation = useNavigation();

  const listItems = [
    { name: "Ver Instancias de Examen", onPress: () => { 
      navigation.navigate('Evaluations', {
        evaluations: semester?.evaluations,
      });
    } },
    { name: "Cuerpo Docente", onPress: () => { 
      navigation.navigate('Teachers', {
        teachers: { chiefTeacher: semester?.comission.chiefTeacher, staffTeachers: [] },
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
      const semesterData: Semester = await semesterRepository.fetchPresentSemesterFromComissionId(commissionId);

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
  }, [isLoading, commissionId]);

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
    <SafeAreaView style={style().view}>
      <ScrollView>
        <View style={style().mainView}>
          <View style={{ margin: 25 }}>
            <Text style={style().centeredHeader1}>{semester.comission.subjectName}</Text>
            <Text style={style().centeredText}>
              {semester.comission.chiefTeacher.firstName} {semester.comission.chiefTeacher.lastName}
            </Text>
          </View>

          <View style={{ marginTop: 25 }}>
            <BasicList items={listItems} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
