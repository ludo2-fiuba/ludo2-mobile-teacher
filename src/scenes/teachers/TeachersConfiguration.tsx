import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { TeacherTuple } from '../../models/TeacherTuple';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import teacherRoles from '../../models/TeacherRoles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { modifyTeacherRoleLocally, updateTeacherRoleInCommission } from '../../features/teachersSlice';
import MaterialIcon from '../../components/MaterialIcon';
import { lightModeColors } from '../../styles/colorPalette';
import { RoundedButton } from '../../components';

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

  console.log(staffTeachers)

  const deleteTeacherFromCommission = () => {
    console.log('deleteTeacherFromCommission: TODO');
  }

  return (
    <ScrollView style={styles.container}>
      {staffTeachers.map(teacherTuple => (
        <View key={teacherTuple.teacher.dni} style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcon name="account" fontSize={24} color={lightModeColors.institutional} style={{ marginRight: 10 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
              <Text style={styles.passingGradeText}>{teacherTuple.teacher.firstName} {teacherTuple.teacher.lastName}</Text>
              <TouchableOpacity
                onPress={deleteTeacherFromCommission}>
                <MaterialIcon name="delete" fontSize={24} color='black' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardBlock}>
            <Text style={styles.passingGradeLabel}>Rol</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={teacherTuple.role}
                onValueChange={(itemValue) => handleRoleChange(teacherTuple.teacher.dni, itemValue)}
              >
                {teacherRoles.map(role => (
                  <Picker.Item key={role.id} label={role.longVersion} value={role.shortVersion} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.cardBlock}>
            <Text style={styles.passingGradeLabel}>Porcentaje auto-asignado para corrección</Text>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              value={teacherTuple.graderWeight+''}
              // onChangeText={}
              placeholder="Ingrese la cantidad de clases"
            />
          </View>
        </View>
      ))}
      <RoundedButton text="Guardar cambios" onPress={saveChanges} style={{MainContainer: { marginBottom: 100 }}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  cardBlock: { paddingHorizontal: 15, paddingBottom: 15 },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  passingGradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightModeColors.institutional,
  },
  passingGradeLabel: {
    fontSize: 14,
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    overflow: 'hidden', // Ensures the picker doesn't overlap the rounded corners
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8
  },
});

export default TeachersConfiguration;
