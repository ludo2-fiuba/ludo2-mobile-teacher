import React, {  } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { RoundedButton } from '../../components';
import { evaluations as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import EvaluationCard from './EvaluationCard';
import { Evaluation } from '../../models/Evaluation';

interface FinalsListProps {
}

interface EvaluationsRouteParams {
  evaluations: Evaluation[];
}

const Evaluations: React.FC<FinalsListProps> = () => {
  const route = useRoute();
  console.log("Route params");
  console.log(route.params);
  
  const evaluations: Evaluation[] = (route.params as EvaluationsRouteParams).evaluations
  const navigation = useNavigation();

  return (
    <FlatList
      contentContainerStyle={style().listView}
      data={evaluations}
      keyExtractor={evaluation => evaluation.id.toString()}
      ListHeaderComponent={() => (
        <RoundedButton
          text="Agregar evaluacion"
          style={{ ...style().button, ...style().listHeaderFooter }}
          onPress={() => {
            navigation.navigate('FinalDateTimePicker', {
              subject: evaluations,
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
            console.log('QR');
            navigation.navigate('QR', {
              final: item
            });
          }}
        >
          <EvaluationCard evaluation={item}/>
        </TouchableOpacity>
      )}
    />
  );
};

export default Evaluations;
