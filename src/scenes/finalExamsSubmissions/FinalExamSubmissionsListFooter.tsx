import { View, Text, Modal, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { RoundedButton } from '../../components'
import { finalExamSubmissions as style } from '../../styles';
import prompt from 'react-native-prompt-android';
import { studentsRepository } from '../../repositories';
import { Student } from '../../models';
import { FinalExamSubmissionStudentCard } from '../../components/FinalExamSubmissionStudentCard';
import SquaredButton from '../../components/SquaredButton';


const FinalExamSubmissionsListFooter = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [studentToAddManually, setStudentToAddManually] = useState<Student | null>(null)

  const fetchStudent = async (padron: string) => {
    try {
      const student = await studentsRepository.getStudentByPadron(padron);
      setStudentToAddManually(student);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Failed to fetch student", error);
      Alert.alert('Error',
        'No pudimos buscar la información del alumno. ' +
        'Asegurate de que el padrón esté escrito correctamente')
    }
  }

  const cancelStudentAddition = () => {
    setStudentToAddManually(null);
    setShowConfirmationModal(false);
  }

  return (
    <View style={style().listHeaderFooter}>
      <RoundedButton
        text="Agregar alumno"
        style={style().button}
        onPress={() => prompt(
          'Padrón del alumno',
          '',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Confirmar',
              onPress: fetchStudent
            },
          ],
          {}
        )}
      />

      <View style={{ marginTop: 10 }}>
        <RoundedButton
          text="Cerrar el Acta"
          style={style().button}
        />
      </View>

      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Desea agregar el siguiente alumno a la entrega?
            </Text>
            <View style={{ maxHeight: 50 }}>
              <FinalExamSubmissionStudentCard student={studentToAddManually!} />
            </View>

            <View style={styles.modalSelectorButtons}>
              <SquaredButton text="Cancelar" onPress={cancelStudentAddition} />
              <View style={styles.modalSelectorConfirmButton}>
                <SquaredButton text="Confirmar" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default FinalExamSubmissionsListFooter


const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 12,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the overlay
  },
  modalView: {
    width: '80%', // Set a width for the modal (adjust as needed)
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 16,
    // textAlign: 'center',
    marginBottom: 15,
  },
  modalSelector: {
    width: '100%',
    marginBottom: 15,
    // Add any additional styling for the modal selector here
  },
  modalSelectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  modalSelectorConfirmButton: {
    marginLeft: 10,
  }
});
