import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppSelector } from '../../hooks';
import { selectSemesterAttendances, selectSemesterData } from '../../features/semesterSlice';
import { ClassAttendance } from '../../models/ClassAttendance';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

import moment from 'moment';

const SemesterAttendances: React.FC = () => {
  const attendances = useAppSelector(selectSemesterAttendances);
  const navigation = useNavigation();

  const onPressAddNewClass = () => {
    navigation.navigate('SemesterAttendanceQR', {});
  } 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Asistencias del semestre',
      headerRight: () => (
        <TouchableOpacity style={styles.navButton} onPress={onPressAddNewClass}>
          <Icon name="add" style={styles.navButtonIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderClassAttendance = ({ item }: { item: ClassAttendance }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AttendanceDetails', { classAttendance: item })}>
      <View style={styles.sessionContainer}>
        <View style={styles.headerRow}>
          <Ionicons name="calendar" size={24} color="#007BFF" />
          <Text style={styles.sessionHeader}>
            {moment(new Date(item.createdAt)).format('DD/MM/YYYY')}
          </Text>
        </View>
        <Text style={styles.dateText}>
          Horario de validez del QR: {moment(new Date(item.createdAt)).format('HH:mm')} - {moment(new Date(item.expiresAt)).format('HH:mm')}
        </Text>
        <Text style={styles.dateText}>
          Cantidad de asistencias: {item.attendances.length}
        </Text>
        {/* <Text style={styles.viewDetailsText}>Ver detalle</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={attendances}
        renderItem={renderClassAttendance}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() => <Text style={styles.noDataText}>No hay clases para este semestre</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  sessionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  viewDetailsText: {
    color: '#007BFF',
    textAlign: 'right',
    marginTop: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  navButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 5,
    opacity: 1,
    marginTop: 5,
  },
  navButtonIcon: {
    fontSize: 20,
  },
});

export default SemesterAttendances;
