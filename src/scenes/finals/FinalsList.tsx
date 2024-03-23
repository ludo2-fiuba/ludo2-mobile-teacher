import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Loading, RoundedButton } from '../../components';
import { getStyleSheet as style } from '../../styles';
import { finalRepository } from '../../repositories';
import { Final } from '../../models';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { makeRequest } from '../../networking/makeRequest';
import FinalsListItem from './FinalsListItem';

interface FinalsListRouteParams {
  subjectId: number;
  subjectName: string;
}

const FinalsList: React.FC = () => {
  const [hasDoneFirstLoad, setHasDoneFirstLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [finals, setFinals] = useState<Final[]>([]);

  const route = useRoute();
  const subjectId = (route.params as FinalsListRouteParams).subjectId;
  const subjectName = (route.params as FinalsListRouteParams).subjectName;

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchData(hasDoneFirstLoad);
      return () => { }; // Return a cleanup function if necessary
    }, [])
  );

  const fetchData = async (refreshing: boolean = false) => {
    if (loading || refreshing) return;

    setRefreshing(refreshing);
    setLoading(!refreshing);
    setHasDoneFirstLoad(true);

    try {
      const retrievedFinals = await makeRequest(() => finalRepository.fetchFromSubject(subjectId), navigation);
      console.log("Retrieved finals", retrievedFinals);
      const orderedFinals = retrievedFinals.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
      setFinals(orderedFinals);
    } catch (error) {
      Alert.alert(
        'Te fallamos',
        'No pudimos encontrar los finales de esta materia. ' +
        'Volvé a intentar en unos minutos.',
      );
      navigation.goBack();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const AddFinalButton = () => (
    <RoundedButton
      text="Agregar final"
      style={style().button}
      onPress={() => {
        navigation.navigate('AddFinal', {
          subjectId: subjectId,
          subjectName: subjectName,
        });
      }}
    />
  );

  return (
    <View style={style().view}>
      {(loading || !hasDoneFirstLoad) && <Loading />}
      {hasDoneFirstLoad && !loading && !finals.length && (
        <View style={style().containerView}>
          <AddFinalButton />
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
            <AddFinalButton />
          )}
          renderItem={({ item }) => (
            <FinalsListItem final={item} subjectId={subjectId} />
          )}
        />
      )}
    </View>
  );
};

export default FinalsList;
