import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import { useNavigation } from '@react-navigation/native';
import { studentsRepository } from '../../repositories';
import { Student } from '../../models';

interface Props {}

export function SemesterHeaderRight({ }: Props) {
  const semesterData = useAppSelector(selectSemesterData);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentPadron, setStudentPadron] = useState<string>('');
  const [student, setStudent] = useState<Student | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const navigation = useNavigation();

  const openAddStudentPrompt = () => {
    setModalVisible(true);
  };

  const handleAddStudent = async () => {
    setModalVisible(false);

    if (studentPadron) {
      try {
        console.log("Student padron", studentPadron);
        const studentData: Student = await studentsRepository.getStudentByPadron(studentPadron);
        setStudent(studentData);
        setConfirmVisible(true);
      } catch (error) {
        Alert.alert('Padrón no existente', `No pudimos encontrar al alumno de padrón ${studentPadron}`);
      }
    }
  };

  const confirmAddStudent = async () => {
    setConfirmVisible(false);
    if (student) {
      try {
        // Add your API call to add the student here
        Alert.alert('Éxito', 'Estudiante agregado exitosamente');
      } catch (error) {
        Alert.alert('Error', 'An error occurred while adding the student');
      }
    }
  };

  return (
    <View style={styles.navButtonsContainer}>
      <TouchableOpacity style={styles.navButton} onPress={openAddStudentPrompt}>
        <Icon name="add" style={styles.navButtonIcon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Padrón del estudiante"
              value={studentPadron}
              onChangeText={setStudentPadron}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="OK" onPress={handleAddStudent} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmVisible}
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalView}>
            {student && (
              <>
                <Text style={styles.studentName}>{student.firstName} {student.lastName} </Text>
                <Text style={{...styles.studentText, marginTop: 10 }}>DNI: {student.dni}</Text>
                <Text style={styles.studentText}>Email: {student.email}</Text>
                <Text style={styles.studentText}>Padron: {student.padron}</Text>
                <View style={{...styles.buttonContainer, marginTop: 10}}>
                  <Button title="Cancelar" onPress={() => setConfirmVisible(false)} />
                  <Button title="Agregar" onPress={confirmAddStudent} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmModalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  studentName: {
    fontSize: 30,
    textAlign: 'left'
  },
  studentText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
