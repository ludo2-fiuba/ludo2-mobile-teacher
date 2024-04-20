import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import StudentSelectionModal from './StudentSelectionModal';



export function SubmissionsHeaderRight() {
  const semesterData = useAppSelector(selectSemesterData);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const addStudentSubmissionToExam = () => {
    setModalVisible(true);
  };

  const saveChanges = () => {
    console.log('Saving changes');
  };

  const generateFinalExamQR = () => {
    console.log('Generating final exam QR');
    navigation.navigate('QRFinalExam', { final: { date: new Date() } });
  }

  return (
    <View style={styles.navButtonsContainer}>
      <StudentSelectionModal
        visible={modalVisible}
        students={semesterData?.students} // Assuming 'students' is part of the semester data
        onSelect={(student: any) => {
          console.log('Selected student', student);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
      />

      <TouchableOpacity style={styles.navButton} onPress={addStudentSubmissionToExam}>
        <Icon name="add" style={styles.navButtonIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={saveChanges}>
        <Icon name="qr-code" style={styles.navButtonIcon} />
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
