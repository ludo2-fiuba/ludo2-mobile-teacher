import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Submission } from '../../models/Submission';
import { submissionsRepository } from '../../repositories';
import { useNavigation } from '@react-navigation/native';
import SubmissionCard from './SubmissionCard';
import { Evaluation } from '../../models/Evaluation';
import { SubmissionsHeaderRight } from './SubmissionsHeaderRight';
import { Loading } from '../../components';

interface Props {
  route: any;
}

interface RouteParams {
  evaluation: Evaluation;
}

export default function SubmissionsList({ route }: Props) {
  const navigation = useNavigation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { evaluation } = route.params as RouteParams;
  
  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Entregas', // Set the screen title
      headerRight: () => <SubmissionsHeaderRight />,
    });
  }, [navigation]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const submissions: Submission[] = await submissionsRepository.getSubmissions(evaluation.id);
      setSubmissions(submissions);
    } catch (error) {
      Alert.alert('Error', 'No pudimos conseguir información. Intenta nuevamente.');
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, [evaluation.id, isLoading]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      setNavOptions();
      fetchData();
    });
    return focusUnsubscribe;
  }, [])

  return (
    <View style={styles.view}>
      {isLoading && <Loading />}
      {!isLoading && (
        <FlatList
          data={submissions}
          keyExtractor={submission => submission.student.dni}
          renderItem={({ item: submission }) => (
            <View style={styles.submissionCard}>
              <SubmissionCard submission={submission} evaluation={evaluation} />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.containerView}>
              <Text style={styles.text}>
                Aún no hay entregas para esta evaluación
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  submissionCard: {
    // Adjusted for smaller card size
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10, // Reduced padding
    marginVertical: 3, // Reduced vertical margin
    marginHorizontal: 5, // Reduced horizontal margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
