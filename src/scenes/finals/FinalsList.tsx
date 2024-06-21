import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Loading, RoundedButton } from '../../components';
import { getStyleSheet as style } from '../../styles';
import { finalRepository } from '../../repositories';
import { Final } from '../../models';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { makeRequest } from '../../networking/makeRequest';
import FinalsListItem from './FinalsListItem';
import { FinalsListHeaderRight } from './FinalsListHeaderRight';
import { FontAwesome } from '@expo/vector-icons';

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

  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Finales',
      headerRight: () => <FinalsListHeaderRight subjectId={subjectId} subjectName={subjectName} />,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      setNavOptions();
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

  return (
    <View style={styles.view}>
      {(loading || !hasDoneFirstLoad) && <Loading />}
      {hasDoneFirstLoad && !loading && !finals.length && (
        <View style={styles.emptyEvaluationsContainer}>
          <FontAwesome name="folder-open" size={50} color="#6c757d" style={styles.emptyEvaluationsIcon} />
          <Text style={styles.emptyEvaluationsText}>Esta comisión no tiene finales aún.</Text>
          <Text style={styles.emptyEvaluationsSecondText}>Podés agregar uno pulsando el '+' en la esquina superior derecha</Text>
        </View>
      )}
      {hasDoneFirstLoad && !loading && !!finals.length && (
        <FlatList
          contentContainerStyle={{ marginTop: 5 }}
          data={finals}
          onRefresh={() => fetchData(true)}
          refreshing={refreshing}
          keyExtractor={final => final.id.toString()}
          renderItem={({ item }) => (
            <FinalsListItem final={item} subjectId={subjectId} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
  },
  listView: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  emptyEvaluationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  emptyEvaluationsText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  emptyEvaluationsSecondText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyEvaluationsIcon: {
    marginBottom: 16,
  },
  reloadButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FinalsList;
