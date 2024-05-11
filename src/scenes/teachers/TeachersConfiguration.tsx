import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { TeacherTuple } from '../../models/Teachers';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import teacherRoles from '../../models/TeacherRoles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { modifyTeacherRoleLocally, updateTeacherRoleInCommission } from '../../features/teachersSlice';
import { Icon } from 'react-native-elements';

interface RouteProps {
  staffTeachers: TeacherTuple[]
  commissionId: number
}

const TeachersConfiguration: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const route = useRoute();
  const commissionId = (route.params as RouteProps).commissionId
  const originalStaffTeachers = (route.params as RouteProps).staffTeachers
  const staffTeachers = useAppSelector((state) => state.teachers.staffTeachers)

  useEffect(() => {

  }, []);

  const handleRoleChange = (teacherDNI: string, newRole: string) => {
    dispatch(modifyTeacherRoleLocally({ teacherDNI: teacherDNI, newRole: newRole }))
  };

  const saveChanges = () => {
    for (const teacherTuple of staffTeachers) {
      const originalTuple = originalStaffTeachers.find(originalTuple => originalTuple.teacher.dni === teacherTuple.teacher.dni);
      if (originalTuple?.role !== teacherTuple.role) {
        dispatch(updateTeacherRoleInCommission({ commissionId: commissionId, teacherId: teacherTuple.teacher.id, newRole: teacherTuple.role }));
      }
    }
    navigation.goBack();
  };

  const deleteTeacherFromCommission = () => {
    console.log('deleteTeacherFromCommission');
    
  }

  return (
    <View style={styles.container}>
      {staffTeachers.map(teacherTuple => (
        <View key={teacherTuple.teacher.dni} style={styles.teacherContainer}>
          <Text style={styles.teacherName}>{teacherTuple.teacher.firstName + ' ' + teacherTuple.teacher.lastName} </Text>
          <View style={styles.pickerAndDeletionRow}>
            <View style={styles.pickerContainer}>
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
            <TouchableOpacity
              onPress={deleteTeacherFromCommission}>
              <Icon style={styles.deleteTeacherIcon} name="delete" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Button title="Guardar cambios" onPress={saveChanges} />
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
    backgroundColor: '#ffffff', // Adds contrast
    borderRadius: 10, // Rounded corners
    padding: 10, // Inner spacing
    shadowColor: '#000', // Shadow for elevation effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 2
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    overflow: 'hidden', // Ensures the picker doesn't overlap the rounded corners
    flex: 1
  },
  picker: {
    backgroundColor: '#ffffff',
  },
  deleteTeacherIcon: {
    fontSize: 24, // Increase size for better visibility
    color: '#d9534f', // Use a color that signifies deletion or caution
    padding: 10, // Easier to tap
  },
  pickerAndDeletionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10, // Space from the teacher name to picker row
  },
});

export default TeachersConfiguration;
