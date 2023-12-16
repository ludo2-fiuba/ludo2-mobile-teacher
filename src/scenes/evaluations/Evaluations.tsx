import React, {  } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { RoundedButton } from '../../components';
import { evaluations as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import EvaluationsListElement from './EvaluationsListElement';
import { Evaluation } from '../../models/Evaluation';
import { Semester } from '../../models/Semester';

interface FinalsListProps {
}

interface EvaluationsRouteParams {
  semester: Semester;
  evaluations: Evaluation[];
}

const Evaluations: React.FC<FinalsListProps> = () => {
  const route = useRoute();
  const semester: Semester = (route.params as EvaluationsRouteParams).semester
  const evaluations: Evaluation[] = (route.params as EvaluationsRouteParams).evaluations
  console.log("Evaluations: ", evaluations);
  const navigation = useNavigation();

  return (
    <FlatList
      style={{ flex: 1 }}
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
          <EvaluationsListElement evaluation={item}/>
        </TouchableOpacity>
      )}
    />
  );
};

export default Evaluations;
