import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import EntitySelectionModal from './EntitySelectionModal';
import { Student } from '../../models';
import { evaluationsRepository } from '../../repositories';
import { Evaluation } from '../../models/Evaluation';

interface Props {
  evaluation: Evaluation
}


export function SubmissionsHeaderRight({ evaluation }: Props) {
  const semesterData = useAppSelector(selectSemesterData);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const saveChanges = () => {
    console.log('Saving changes');
  };

  const generateFinalExamQR = () => {
    navigation.navigate('QRFinalExam', { final: { date: new Date() } });
  }

  const addStudentSubmission = async (student: Student) => {
    setModalVisible(false);
    const result = await evaluationsRepository.addStudent(evaluation.id, student.padron, null)
    console.log(result);
  }

  return (
    <View style={styles.navButtonsContainer}>
      <EntitySelectionModal
        visible={modalVisible}
        entities={semesterData?.students || []}
        onSelect={(student: any) =>  addStudentSubmission(student)}
        onClose={() => setModalVisible(false)}
        title="Estudiantes del semestre"
      />

      <TouchableOpacity style={styles.navButton} onPress={() => {setModalVisible(true)}}>
        <Icon name="add" style={styles.navButtonIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={saveChanges}>
        <Icon name="save" style={styles.navButtonIcon} />
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
  navButtonIcon: {
    fontSize: 20,
  },
});
