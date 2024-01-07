import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TeacherTuple } from '../../models/Teachers';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { teachersRepository } from '../../repositories';
import teacherRoles from '../../models/TeacherRoles';

interface RouteProps {
  staffTeachers: TeacherTuple[]
  commissionId: number
}

const TeachersConfiguration: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const commissionId = (route.params as RouteProps).commissionId
  const originalStaffTeachers = (route.params as RouteProps).staffTeachers
  const [staffTeachers, setStaffTeachers] = useState((route.params as RouteProps).staffTeachers)

  useEffect(() => {

  }, []);

  const handleRoleChange = (teacherDNI: string, newRole: string) => {
    setStaffTeachers(staffTeachers.map(teacher => 
      teacher.teacher.dni === teacherDNI ? { ...teacher, role: newRole } : teacher
    ));
  };

  const saveChanges = () => {
    for (const teacherTuple of staffTeachers) {
      const originalTuple = originalStaffTeachers.find(originalTuple => originalTuple.teacher.dni === teacherTuple.teacher.dni);
      if (originalTuple?.role !== teacherTuple.role) {
        teachersRepository.modifyRoleOfTeacherInCommission(commissionId, teacherTuple.teacher.id, teacherTuple.role);
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {staffTeachers.map(teacherTuple => (
        <View key={teacherTuple.teacher.dni} style={styles.teacherContainer}>
          <Text style={styles.teacherName}>{teacherTuple.teacher.firstName + ' ' + teacherTuple.teacher.lastName} </Text>
          <Picker
            style={styles.picker}
            selectedValue={teacherTuple.role}
            onValueChange={(itemValue) => handleRoleChange(teacherTuple.teacher.dni, itemValue)}
          >
            {teacherRoles.map(role => (
              <Picker.Item key={role.id} label={role.longVersion} value={role.shortVersion} />
            ))}
          </Picker>
        </View>
      ))}
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  teacherContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 10,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
});

export default TeachersConfiguration;
