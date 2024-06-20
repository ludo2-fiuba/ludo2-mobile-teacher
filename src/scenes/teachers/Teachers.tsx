import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { lightModeColors } from '../../styles/colorPalette';
import TeachersHeaderRight from './TeachersHeaderRight';
import { Loading } from '../../components';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTeachers } from '../../features/teachersSlice';
import { Teacher } from '../../models';
import { mapWeightToPercentage } from '../../utils/graderWeightConversions';
import { selectSemesterData } from '../../features/semesterSlice';
import { Semester } from '../../models/Semester';
const UserIcon = require('../img/usericon.jpg');


const ChiefCard = ({ firstName, lastName, graderPercentage }: { firstName: string, lastName: string, graderPercentage: string }) => {
  return (
    <View style={styles.leaderCardContainer}>
      <Image source={UserIcon} style={styles.leaderImage} />
      <View style={styles.leaderInfoContainer}>
        <Text style={styles.leaderName}>{firstName} {lastName}</Text>
        <Text style={styles.leaderRole}>{'Profesor Titular'}</Text>
        <Text style={styles.graderPercentage}>Ponderación para correcciones: {graderPercentage}%</Text>
      </View>
    </View>
  );
};


const TeacherCard = ({ teacher, role, graderPercentage }: { teacher: Teacher, role: string, graderPercentage: string }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={UserIcon} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{teacher.firstName + ' ' + teacher.lastName} </Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.email}>{teacher.email}</Text>
        <Text style={styles.graderPercentage}>Ponderación para correcciones: {graderPercentage}%</Text>
      </View>
    </View>
  );
};

interface TeachersScreenProps {
  route: any;
}

interface TeachersRouteParams {
  commissionId: number;
  chiefTeacher: Teacher;
}


const TeachersScreen = ({ route }: TeachersScreenProps) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const commissionId = (route.params as TeachersRouteParams).commissionId;
  const chiefTeacher = (route.params as TeachersRouteParams).chiefTeacher;

  const { staffTeachers, allTeachers, isLoading, error } = useAppSelector((state) => state.teachers);
  const semester: Semester = useAppSelector(selectSemesterData)!
  const chiefTeacherGraderWeight = semester.commission.chiefTeacherGraderWeight;
  console.log(chiefTeacherGraderWeight, staffTeachers);
  

  useEffect(() => {
    const navOptions = {
      headerRight: () => (
        <TeachersHeaderRight
          staffTeachers={staffTeachers}
          allTeachers={allTeachers}
          commissionId={commissionId}
        />
      ),
    };
    navigation.setOptions(navOptions);
  }, [allTeachers, commissionId, navigation, staffTeachers])


  const fetchData = useCallback(async () => {
    if (isLoading) return;

    try {
      dispatch(fetchTeachers(commissionId))
    } catch (error) {
      console.error('Error fetching data', error);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos conseguir información acerca del semestre. ' +
        'Volvé a intentar en unos minutos.',
      );
    }
  }, [dispatch, isLoading, commissionId]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusUnsubscribe;
  }, [fetchData, navigation])

  return (
    <SafeAreaView style={styles.container}>
      {chiefTeacher &&
        <ChiefCard
          firstName={chiefTeacher.firstName}
          lastName={chiefTeacher.lastName}
          graderPercentage={mapWeightToPercentage(chiefTeacherGraderWeight, staffTeachers, chiefTeacherGraderWeight)}
        />}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Cuerpo docente</Text>
      </View>
      {isLoading && <Loading />}
      {!isLoading &&
        <FlatList
          data={staffTeachers}
          renderItem={({ item }) =>
            <TeacherCard
              teacher={item.teacher}
              role={item.role}
              graderPercentage={mapWeightToPercentage(item.graderWeight, staffTeachers, chiefTeacherGraderWeight)}
            />}
          keyExtractor={item => item.teacher.dni}
          style={styles.list}
          ListEmptyComponent={() => <Text style={styles.emptyStaffTeachersList}>No hay docentes auxiliares</Text>}
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    margin: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
    color: lightModeColors.institutional
  },
  role: {
    color: 'gray',
    fontSize: 14,
  },
  email: {
    color: 'gray',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15, // Adjust as needed
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  leaderCardContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // You can change the color as per your UI design
  },
  leaderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
  },
  leaderInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  leaderName: {
    fontWeight: 'bold',
    fontSize: 24,
    color: lightModeColors.institutional
  },
  leaderRole: {
    color: 'gray',
    fontSize: 18,
  },
  emptyStaffTeachersList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18
  },
  graderPercentage: {
    color: 'gray',
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default TeachersScreen;
