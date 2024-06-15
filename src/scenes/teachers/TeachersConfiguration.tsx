import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
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
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const commissionId = (route.params as RouteProps).commissionId;
  const originalStaffTeachers = (route.params as RouteProps).staffTeachers;
  const staffTeachers = useAppSelector((state) => state.teachers.staffTeachers);
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherTuple | null>(null);

  useEffect(() => {

  }, []);

  const handleRoleChange = (teacherDNI: string, newRole: string) => {
    dispatch(modifyTeacherRoleLocally({ teacherDNI: teacherDNI, newRole: newRole }));
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
    if (teacherToDelete) {
      // Add your delete logic here
      console.log('Deleting teacher:', teacherToDelete.teacher.firstName, teacherToDelete.teacher.lastName);
      setIsModalVisible(false);
    }
  };

  const toggleAccordion = (teacherDNI: string) => {
    setExpandedTeacher(prev => (prev === teacherDNI ? null : teacherDNI));
  };

  const confirmDeleteTeacher = (teacherTuple: TeacherTuple) => {
    setTeacherToDelete(teacherTuple);
    setIsModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {staffTeachers.map(teacherTuple => (
        <View key={teacherTuple.teacher.dni} style={styles.card}>
          <TouchableOpacity onPress={() => toggleAccordion(teacherTuple.teacher.dni)} style={styles.cardItem}>
            <MaterialIcon name="account" fontSize={24} color={lightModeColors.institutional} style={{ marginRight: 10 }} />
            <Text style={styles.passingGradeText}>{teacherTuple.teacher.firstName} {teacherTuple.teacher.lastName}</Text>
            <MaterialIcon name={expandedTeacher === teacherTuple.teacher.dni ? "chevron-up" : "chevron-down"} fontSize={24} color='black' />
          </TouchableOpacity>
          {expandedTeacher === teacherTuple.teacher.dni && (
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
                <Text style={styles.passingGradeLabel}>Porcentaje auto-asignado para corrección</Text>
                <TextInput
                  style={styles.input}
                  keyboardType='numeric'
                  value={teacherTuple.graderWeight + ''}
                  // onChangeText={}
                  placeholder="Ingrese la cantidad de clases"
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

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={styles.modalMessage}>
              ¿Está seguro de que desea eliminar a {teacherToDelete?.teacher.firstName} {teacherToDelete?.teacher.lastName}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteTeacherFromCommission} style={[styles.modalButton, styles.confirmButton]}>
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TeachersConfiguration;
