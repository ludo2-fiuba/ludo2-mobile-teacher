import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Loading, RoundedButton } from '../../components';
import { evaluations as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import EvaluationsListElement from './EvaluationsListElement';
import { Evaluation } from '../../models/Evaluation';
import { Semester } from '../../models/Semester';
import { makeRequest } from '../../networking/makeRequest';
import { evaluationsRepository } from '../../repositories';
import { EvaluationsListHeaderRight } from './EvaluationsListHeaderRight';

interface EvaluationsProps {
  // No specific props if not needed
}

interface EvaluationsRouteParams {
  semester: Semester;
  evaluations: Evaluation[];
}

const EvaluationsList: React.FC<EvaluationsProps> = () => {
  const route = useRoute();
  const semester: Semester = (route.params as EvaluationsRouteParams).semester;
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Evaluaciones',
      headerRight: () => <EvaluationsListHeaderRight />,
    });
  }, [navigation]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      setNavOptions();
    });
    return focusUnsubscribe;
  }, [])

  const fetchData = async () => {
    try {
      const evaluationsData: Evaluation[] = await makeRequest(() => evaluationsRepository.fetchPresentSemesterEvaluations(semester.commission.id), navigation);
      setEvaluations(evaluationsData);
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
  };

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return () => focusUnsubscribe();
  }, [navigation, fetchData]);

  return (
    <View style={{ flex: 1, height: '100%' }}>
      {loading && <Loading />}
      {!loading && (
        <FlatList
          style={{ flex: 1, height: '100%' }}
          contentContainerStyle={evaluations.length === 0
            ? { flexGrow: 1, backgroundColor: 'white' }
            : style().listView}
          data={evaluations}
          keyExtractor={evaluation => evaluation.id.toString()}
          ListEmptyComponent={() => (
            <View style={style().emptyEvaluationsContainer}>
              <Text style={style().emptyEvaluationsText}>No hay evaluaciones registradas por el momento</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SubmissionsList', {
                  evaluation: item,
                });
              }}
            >
              <EvaluationsListElement evaluation={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default EvaluationsList;