import React from 'react'
import { View, Image, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import teacherRoles from '../../models/TeacherRoles';
import { Teacher } from '../../models/Teachers';
import { lightModeColors } from '../../styles/colorPalette';
import { Loading } from '../../components';
import { useRoute } from '@react-navigation/native';
import TeachersSearchBar from './TeachersSearchBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { increment, selectCount } from '../../features/counter/counterSlice';

const UserIcon = require('../img/usericon.jpg');

const TeacherCard = ({ teacher, role }: { teacher: Teacher, role: string }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={UserIcon} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{teacher.firstName + ' ' + teacher.lastName} </Text>
        <Text style={styles.role}>{teacherRoles.find(actualRole => actualRole.shortVersion === role)?.longVersion}</Text>
        <Text style={styles.email}>{teacher.email}</Text>
      </View>
    </View>
  );
};

interface RouteProps {
  staffTeachers: { teacher: Teacher, role: string }[];
  allTeachers: Teacher[];
  commissionId: number;
}

function AddTeachersConfigurationList() {
  const route = useRoute()
  const allTeachers = (route.params as RouteProps).allTeachers
  const commissionId = (route.params as RouteProps).commissionId
  
  const staffTeachers = useAppSelector((state) => state.teachers.staffTeachers)

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Agregar un docente</Text>
    </View>
    <View> 
      <TeachersSearchBar allTeachers={allTeachers} commissionId={commissionId}/>
    </View>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Lista de docentes actuales</Text>
    </View>
    <FlatList
      data={staffTeachers}
      renderItem={({ item }) => <TeacherCard teacher={item.teacher} role={item.role} />}
      keyExtractor={item => item.teacher.dni}
      style={styles.list}
      ListEmptyComponent={() => <Text style={styles.emptyStaffTeachersList}>No hay docentes auxiliares</Text>}
    />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background
  },
  list: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  role: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  email: {
    color: '#666',
    fontSize: 14,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyStaffTeachersList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default AddTeachersConfigurationList