import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import EntitySelectionModal from './EntitySelectionModal';
import { Student } from '../../models';
import { evaluationsRepository, submissionsRepository } from '../../repositories';
import { Evaluation } from '../../models/Evaluation';
import MaterialIcon from '../../components/MaterialIcon';

interface Props {
  evaluation: Evaluation;
  fetchData: () => Promise<void>
  isActualUserChiefTeacher: boolean;
}


export function SubmissionsHeaderRight({ evaluation, fetchData, isActualUserChiefTeacher }: Props) {
  const semesterData = useAppSelector(selectSemesterData);
  const [modalVisible, setModalVisible] = useState(false);

  const addStudentSubmission = async (student: Student) => {
    setModalVisible(false);
    const result = await evaluationsRepository.addSubmissionToEvaluation(evaluation.id, student.id)
    console.log(result);
    // force-refresh
    fetchData();
  }

  const autoAssignGraders = async () => {
    await submissionsRepository.autoAssignGraders(evaluation.id);
    // force-refresh
    fetchData();
  };

  const showConfirmAutoAssignGraders = () => {
    Alert.alert(
      'Auto-asignar correctores',
      `¿Está seguro de que desea auto-asignar correctores para las entregas? Se sobreescribirán los correctores ya asignados \n\nPara ajustar los porcentajes diríjase a Cuerpo Docente > Editar`,
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
  }

  return (
    <View style={styles.navButtonsContainer}>
      <EntitySelectionModal
        visible={modalVisible}
        entities={semesterData?.students || []}
        onSelect={(student: any) => addStudentSubmission(student)}
        onClose={() => setModalVisible(false)}
        title="Agregar entrega manualmente"
      />

      {
        isActualUserChiefTeacher && (
          <TouchableOpacity style={styles.navButton} onPress={showConfirmAutoAssignGraders}>
            <MaterialIcon name="auto-fix" fontSize={24} color='gray' />
          </TouchableOpacity>
        )
      }
      <TouchableOpacity style={styles.navButton} onPress={() => { setModalVisible(true) }}>
        <MaterialIcon name="plus" fontSize={24} color='gray' />
      </TouchableOpacity>
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
});
