import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import EntitySelectionModal from './EntitySelectionModal';
import { Student } from '../../models';
import { evaluationsRepository, submissionsRepository } from '../../repositories';
import { Evaluation } from '../../models/Evaluation';
import MaterialIcon from '../../components/MaterialIcon';
import { Submission } from '../../models/Submission';

interface Props {
  evaluation: Evaluation;
  submissions: Submission[];
  fetchData: () => Promise<void>;
  isActualUserChiefTeacher: boolean;
}

export function SubmissionsHeaderRight({ evaluation, fetchData, isActualUserChiefTeacher, submissions }: Props) {
  const semesterData = useAppSelector(selectSemesterData);
  const [modalVisible, setModalVisible] = useState(false);

  const addStudentSubmission = async (student: Student) => {
    setModalVisible(false);
    await evaluationsRepository.addSubmissionToEvaluation(evaluation.id, student.id);
    // Force-refresh
    fetchData();
  };

  const autoAssignGraders = async () => {
    await submissionsRepository.autoAssignGraders(evaluation.id);
    // Force-refresh
    fetchData();
  };

  const showConfirmAutoAssignGraders = () => {
    Alert.alert(
      'Auto-asignar correctores',
      `¿Está seguro de que desea auto-asignar correctores para las entregas aún no calificadas? Se sobreescribirán los correctores ya asignados \n\nPara ajustar las ponderaciones diríjase a Cuerpo Docente > Editar`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: autoAssignGraders,
        },
      ]
    );
  };

  const semesterStudentsThatHaveNotSubmitted = () => {
    const submissionsStudents = submissions.map(sub => sub.student);
    const students = semesterData?.students || [];

    const semesterStudentsThatHaveNotSubmitted = [];
    for (const student of students) {
      const studentHasSubmitted = submissionsStudents.some(subStudent => subStudent.id === student.id);

      // Only show those who have not submitted
      if (!studentHasSubmitted) {
        semesterStudentsThatHaveNotSubmitted.push(student);
      }
    }
    return semesterStudentsThatHaveNotSubmitted;
  };

  const getTitleIfThereAreStudentsToBeAdded = () => {
    const students = semesterStudentsThatHaveNotSubmitted();
    if (students.length > 0) {
      return 'Seleccione un alumno para agregar a la entrega';
    }
    return 'No hay alumnos para agregar a la entrega';
  }

  return (
    <View style={styles.navButtonsContainer}>
      <EntitySelectionModal
        visible={modalVisible}
        entities={semesterStudentsThatHaveNotSubmitted()}
        onSelect={(student: any) => addStudentSubmission(student)}
        onClose={() => setModalVisible(false)}
        title={getTitleIfThereAreStudentsToBeAdded()}
      />

      {isActualUserChiefTeacher && (
        <TouchableOpacity style={styles.navButton} onPress={showConfirmAutoAssignGraders}>
          <MaterialIcon name="auto-fix" fontSize={24} color="gray" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.navButton} onPress={() => setModalVisible(true)}>
        <MaterialIcon name="plus" fontSize={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: 'row',
  },
  navButton: {
    marginRight: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
