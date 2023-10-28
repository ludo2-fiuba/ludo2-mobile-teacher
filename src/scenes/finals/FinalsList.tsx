import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { FinalCard, Loading, RoundedButton } from '../../components';
import { getStyleSheet as style } from '../../styles';
import { finalRepository } from '../../repositories';
import { FinalStatus, Subject } from '../../models';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { makeRequest } from '../../networking/makeRequest';

interface FinalsListProps {
}

interface FinalsListRouteParams {
  subject: Subject;
}

const FinalsList: React.FC<FinalsListProps> = () => {
  const [hasDoneFirstLoad, setHasDoneFirstLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [finals, setFinals] = useState<any[]>([]);
  
  const route = useRoute();
  const subject = (route.params as FinalsListRouteParams).subject
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchData(hasDoneFirstLoad);
      return () => {}; // Return a cleanup function if necessary
    }, [hasDoneFirstLoad])
  );

  const fetchData = (refreshing: boolean = false) => {
    if (loading || refreshing) return;

    setRefreshing(refreshing);
    setLoading(!refreshing);
    setHasDoneFirstLoad(true);

    // Assuming request method is available globally or via a custom hook
    makeRequest(() => finalRepository.fetchFromSubject(subject?.id), navigation)
      .then((retrievedFinals: any) => {
        const orderedFinals = retrievedFinals.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
        setFinals(orderedFinals);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error: string) => {
        setLoading(false);
        setRefreshing(false);
        Alert.alert(
          'Te fallamos',
          'No pudimos encontrar los finales de esta materia. ' +
            'Volvé a intentar en unos minutos.',
        );
        navigation.goBack();
      });
  };

  return (
    <View style={style().view}>
      {(loading || !hasDoneFirstLoad) && <Loading />}
      {hasDoneFirstLoad && !loading && !finals.length && (
        <View style={style().containerView}>
          <RoundedButton
            text="Agregar final"
            style={style().button}
            onPress={() => {
              navigation.navigate('FinalDateTimePicker', {
                subject: subject,
              });
            }}
          />
          <Text style={style().text}>
            Esta comisión no tiene finales aún.
          </Text>
        </View>
      )}
      {hasDoneFirstLoad && !loading && !!finals.length && (
        <FlatList
          contentContainerStyle={style().listView}
          data={finals}
          onRefresh={() => fetchData(true)}
          refreshing={refreshing}
          keyExtractor={final => final.id.toString()}
          ListHeaderComponent={() => (
            <RoundedButton
              text="Agregar final"
              style={{ ...style().button, ...style().listHeaderFooter }}
              onPress={() => {
                navigation.navigate('FinalDateTimePicker', {
                  subject: subject,
                });
              }}
            />
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
            onPress={() => {
              if (
                item.currentStatus() == FinalStatus.Draft ||
                item.currentStatus() == FinalStatus.Rejected
              ) {
                return;
              }
              if (item.currentStatus() == FinalStatus.Future) {
                console.log('Final status: Future');
                Alert.alert('Bajá esa ansiedad, todavía falta.');
              } else if (item.currentStatus() == FinalStatus.Closed) {
                console.log('Final status: Closed');
                navigation.navigate('FinalExamsList', {
                  final: item.toObject(),
                  editable: false,
                });
              } else if (item.currentStatus() == FinalStatus.Grading) {
                console.log('Final status: Grading');
                const finalToBeSent = item.toObject();
                console.log("Final to be sent", finalToBeSent);
                                
                navigation.navigate('FinalExamsList', {
                  final: finalToBeSent,
                });
              } else {
                console.log('QR');
                navigation.navigate('QR', {
                  final: item.toObject(),
                });
              }
            }}>
              <FinalCard final={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default FinalsList;
