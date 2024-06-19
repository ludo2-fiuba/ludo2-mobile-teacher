import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TeacherTuple } from '../../models/TeacherTuple';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import teacherRoles from '../../models/TeacherRoles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { modifyTeacherRoleLocally, modifyTeacherWeightLocally, updateTeacherInCommission } from '../../features/teachersSlice';
import MaterialIcon from '../../components/MaterialIcon';
import { lightModeColors } from '../../styles/colorPalette';
import { PercentageInput, RoundedButton } from '../../components';
import { computeWeightsToPercentages, mapPercentageToWeight } from '../../utils/graderWeightConversions';

interface RouteProps {
  staffTeachers: TeacherTuple[]
  commissionId: number
}

const TeachersConfiguration: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const commissionId = (route.params as RouteProps).commissionId;
  const originalStaffTeachers = (route.params as RouteProps).staffTeachers;
  const staffTeachers = useAppSelector((state) => state.teachers.staffTeachers);
  const staffGraderWeightsToPercentages = useMemo(() => computeWeightsToPercentages(staffTeachers), [staffTeachers]);

  const [expandedTeachers, setExpandedTeachers] = useState<string[]>([]);

  const handleRoleChange = (teacherDNI: string, newRole: string) => {
    dispatch(modifyTeacherRoleLocally({ teacherDNI: teacherDNI, newRole: newRole }));
  };

  const handleWeightChange = (teacherDNI: string, newPercentageInput: number) => {
    const asPercentage = newPercentageInput / 100;
    if (asPercentage) {
      const newWeight = mapPercentageToWeight(teacherDNI, asPercentage, staffTeachers);
      dispatch(modifyTeacherWeightLocally({ teacherDNI, newWeight }));
    }
  };

  const saveChanges = () => {
    for (const teacherTuple of staffTeachers) {
      const originalTuple = originalStaffTeachers.find(originalTuple => originalTuple.teacher.dni === teacherTuple.teacher.dni);
      if (originalTuple?.role !== teacherTuple.role || originalTuple?.graderWeight !== teacherTuple.graderWeight) {
        dispatch(updateTeacherInCommission(
          {
            commissionId: commissionId,
            teacherId: teacherTuple.teacher.id,
            newRole: teacherTuple.role,
            newWeight: teacherTuple.graderWeight
          }));
      }
    }
    navigation.goBack();
  };

  const toggleAccordion = (teacherDNI: string) => {
    setExpandedTeachers(prev =>
      prev.includes(teacherDNI)
        ? prev.filter(dni => dni !== teacherDNI)
        : [...prev, teacherDNI]
    );
  };

  const confirmDeleteTeacher = (teacherTuple: TeacherTuple) => {
    if (teacherTuple) {
      Alert.alert(
        'Confirmar eliminación',
        `¿Está seguro de que desea eliminar a ${teacherTuple.teacher.firstName} ${teacherTuple.teacher.lastName} del cuerpo docente?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            onPress: () => console.log("TODO: API endpoint para eliminar profesor"),
          },
        ]
      )
    }

  };

  return (
    <ScrollView style={styles.container}>
      {staffTeachers.map((teacherTuple, index) => (
        <View key={teacherTuple.teacher.dni} style={styles.card}>
          <TouchableOpacity onPress={() => toggleAccordion(teacherTuple.teacher.dni)} style={styles.cardItem}>
            <MaterialIcon name="account" fontSize={24} color={lightModeColors.institutional} style={{ marginRight: 10 }} />
            <Text style={styles.passingGradeText}>{teacherTuple.teacher.firstName} {teacherTuple.teacher.lastName}</Text>
            <MaterialIcon name={expandedTeachers.includes(teacherTuple.teacher.dni) ? "chevron-up" : "chevron-down"} fontSize={24} color='black' />
          </TouchableOpacity>
          {expandedTeachers.includes(teacherTuple.teacher.dni) && (
            <View>
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
                <Text style={styles.passingGradeLabel}>Porcentaje (%) auto-asignado para correcciones</Text>
                <PercentageInput
                  initialValue={staffGraderWeightsToPercentages[index]}
                  onBlur={(value) => handleWeightChange(teacherTuple.teacher.dni, value)}
                />
              </View>
              <TouchableOpacity
                onPress={() => confirmDeleteTeacher(teacherTuple)}
                style={styles.deleteButton}
              >
                <MaterialIcon name="delete" fontSize={24} color='white' />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <RoundedButton text="Guardar cambios" onPress={saveChanges} style={{ MainContainer: { marginBottom: 100 } }} />
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
    padding: 15,
    justifyContent: 'space-between'
  },
  cardBlock: { paddingHorizontal: 15, paddingBottom: 15 },
  passingGradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightModeColors.institutional,
  },
  passingGradeLabel: {
    fontSize: 14,
    color: 'black',
    marginBottom: 4,
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
    borderRadius: 8,
    height: 55, // match Picker height
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default TeachersConfiguration;
