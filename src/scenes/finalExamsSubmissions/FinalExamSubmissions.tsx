import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Loading, RoundedButton} from '../../components';
import {finalExamSubmissions as style} from '../../styles';
import {Final} from '../../models'; // Assuming there's a Final model
import FinalExamSubmissionsCard from './FinalExamSubmissionsCard';
import { finalRepository } from '../../repositories';
import FinalExam from '../../models/FinalExam';
import { useNavigation, useRoute } from '@react-navigation/native';
import FinalExamSubmissionsListFooter from './FinalExamSubmissionsListFooter';

Icon.loadFont();

interface FinalExamSubmissionsRouteParams {
  final: Final;
}

const FinalExamSubmissions: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const final = (route.params as FinalExamSubmissionsRouteParams).final;
  const [loading, setLoading] = useState<boolean>();
  const [finalExams, setFinalExams] = useState<FinalExam[]>([])

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setFinalExams([]);
    // setGradeChanges(new Set());

    try {
      const finalExamsData = await finalRepository.getFinalExamsFor(final.id);
      setFinalExams(finalExamsData);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar los exámenes. ' +
          'Volvé a intentar en unos minutos.',
      );
      navigation.goBack();
    }
  }, [final.id, loading, navigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <View style={style().view}>
      {loading && <Loading />}
      {!loading && !finalExams.length && (
        <View style={style().containerView}>
          <Text style={style().text}>No se han registrado alumnos que hayan rendido.</Text>
        </View>
      )}
      {!loading && (
        <FlatList
          contentContainerStyle={style().listView}
          data={finalExams}
          keyExtractor={(exam) => exam.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity>
              <FinalExamSubmissionsCard
                disabled={false}
                exam={item}
                initialGrade={item.grade}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={FinalExamSubmissionsListFooter}
        />
      )}
    </View>
  );
};

export default FinalExamSubmissions;
