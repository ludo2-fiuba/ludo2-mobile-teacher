import { View, Text, Alert, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Submission } from '../../models/Submission'
import { submissionsRepository } from '../../repositories';
import { useNavigation } from '@react-navigation/native';
import { evaluationGradesList as style } from '../../styles';
import { EvaluationCard, Loading } from '../../components';
import { SwipeListView } from 'react-native-swipe-list-view';
import SubmissionCard from './SubmissionCard';
import { Evaluation } from '../../models/Evaluation';


interface Props {
  route: any;
}

interface RouteParams {
  evaluation: Evaluation;
}

export default function SubmissionsList({ route }: Props) {
  const navigation = useNavigation();
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const evaluationId = (route.params as RouteParams).evaluation.id;  
  

  const fetchData = useCallback(async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      const submissions: Submission[] = await submissionsRepository.getSubmissions(evaluationId);
      console.log('Submissions', submissions);
      setSubmissions(submissions);
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
  }, [isLoading, evaluationId]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusUnsubscribe;
  }, [])
  

  return (
    <View style={style().view}>
    {isLoading && <Loading />}
    
    {!isLoading && (
      <FlatList
        data={submissions}
        keyExtractor={submission => submission.student.dni}
        renderItem={({ item: submission }) => (
          <SubmissionCard submission={submission}/>
        )}
        ListEmptyComponent={() => (
          <View style={style().containerView}>
            <Text style={style().text}>
              Aún no hay entregas para esta evaluación
            </Text>
          </View>
        )}
      />
    )}
    </View>
)}