import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { CommissionCard, Loading } from '../../components';
import { commissions as style } from '../../styles';
import { commissionRepository } from '../../repositories';
import { makeRequest } from '../../networking/makeRequest';

interface CommissionsListProps {
  navigation: any;  // Specify a more accurate type if possible
}

const CommissionsList: React.FC<CommissionsListProps> = ({ navigation }) => {
  const [hasDoneFirstLoad, setHasDoneFirstLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // TODO alvaro: Type Commission using backend received data
  const [commissions, setCommissions] = useState<any[]>([]);

  const fetchData = useCallback(async (isRefreshing: boolean = false) => {
    if (loading || refreshing) {
      return;
    }
    isRefreshing ? setRefreshing(true) : setLoading(true);
    setHasDoneFirstLoad(true);

    try {
      const commissionsData = await makeRequest(() => commissionRepository.fetchAll(), navigation);
      isRefreshing ? setRefreshing(false) : setLoading(false);
      setCommissions(commissionsData);
    } catch (error) {
      isRefreshing ? setRefreshing(false) : setLoading(false);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar tus comisiones. ' +
        'Volvé a intentar en unos minutos.',
      );
    }
  }, [loading, refreshing]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData(hasDoneFirstLoad);
    });
    return () => focusUnsubscribe();
  }, [navigation, fetchData, hasDoneFirstLoad]);

  return (
    <View style={style().view}>
      {(loading || !hasDoneFirstLoad) && <Loading />}
      {hasDoneFirstLoad && !loading && !commissions.length && (
        <View style={style().containerView}>
          <Text style={style().text}>No tenés comisiones asignadas aún.</Text>
        </View>
      )}
      {hasDoneFirstLoad && !loading && (
        <FlatList
          contentContainerStyle={style().listView}
          data={commissions}
          onRefresh={() => fetchData(true)}
          refreshing={refreshing}
          keyExtractor={(commission) => commission.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FinalsList', {
                  subject: item.subject.toObject(),
                });
              }}>
              <CommissionCard commission={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CommissionsList;
