import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Loading, RoundedButton } from '../../components';
import { evaluations as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import EvaluationsListElement from './EvaluationsListElement';
import { Evaluation } from '../../models/Evaluation';
import { Semester } from '../../models/Semester';
import { Commission } from '../../models';
import { makeRequest } from '../../networking/makeRequest';
import { evaluationsRepository } from '../../repositories';

interface FinalsListProps {
}

interface EvaluationsRouteParams {
  semester: Semester;
  evaluations: Evaluation[];
}

const Evaluations: React.FC<FinalsListProps> = () => {
  const route = useRoute();
  const semester: Semester = (route.params as EvaluationsRouteParams).semester
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const evaluationsData: Evaluation[] = await makeRequest(() => evaluationsRepository.fetchPresentSemesterEvaluations(semester.commission.id), navigation);
      setEvaluations(evaluationsData)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);

      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar tus evaluaciones. ' +
        'Volvé a intentar en unos minutos.',
      );
    }
  }

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return () => focusUnsubscribe();
  }, [navigation, fetchData]);

  const EvaluationsList = () => {
    console.log("Evaluations list", evaluations);

    return (
      <FlatList
        style={{ flex: 1, height: '100%' }}
        contentContainerStyle={evaluations.length === 0
          ? { flexGrow: 1, backgroundColor: 'white' }
          : style().listView}
        data={evaluations}
        keyExtractor={evaluation => evaluation.id.toString()}
        ListHeaderComponent={() => (
          <RoundedButton
            text="Agregar evaluacion"
            style={{ ...style().button, ...style().listHeaderFooter }}
            onPress={() => {
              navigation.navigate('AddEvaluation', {
                semesterToBeAddedAnEvaluation: semester,
              });
            }}
          />
        )}
        ListEmptyComponent={() => {
          return (
            <View style={style().emptyEvaluationsContainer}>
              <Text style={style().emptyEvaluationsText}>No hay evaluaciones registradas por el momento</Text>
            </View>
          );
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              const evaluation = item
              navigation.navigate('SubmissionsList', {
                evaluation: evaluation
              });

            }}
          >
            <EvaluationsListElement evaluation={item} />
          </TouchableOpacity>
        )}
      />
    )
  }

  return (
    <View style={{ flex: 1, height: '100%' }}>
      {loading && <Loading />}
      {!loading && <EvaluationsList />}
    </View>
  );
};

export default Evaluations;
