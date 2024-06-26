import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import { Loading } from '../../components';
import { finalRepository } from '../../repositories';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Final } from '../../models';
import { FinalExam } from '../../models/FinalExam';
import { FinalExamSubmissionsHeaderRight } from './FinalExamSubmissionsHeaderRight';
import { useAppSelector } from '../../hooks';
import { selectUserData } from '../../features/userDataSlice';
import FinalExamSubmissionsListFooter from './FinalExamSubmissionsListFooter';
import { selectSemesterData } from '../../features/semesterSlice';
import * as Yup from 'yup';

interface FinalExamSubmissionsRouteParams {
  final: Final;
}

const FinalExamSubmissions: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const final = (route.params as FinalExamSubmissionsRouteParams).final;
  const [loading, setLoading] = useState<boolean>(false);
  const [finalExams, setFinalExams] = useState<FinalExam[]>([]);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [gradeText, setGradeText] = useState<string>('');

  const userData = useAppSelector(selectUserData);
  const semesterData = useAppSelector(selectSemesterData);
  const isActualUserChiefTeacher = userData?.id === semesterData?.commission.chiefTeacher.id;

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const finalData = await finalRepository.getDetail(final.id);
      setFinalExams(finalData.finalExams.sort((a, b) => a.student.lastName.localeCompare(b.student.lastName)));
    } catch (error) {
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar los exámenes. Volvé a intentar en unos minutos.',
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [final.id, loading, navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Entregas del final',
      headerRight: () => <FinalExamSubmissionsHeaderRight final={final} fetchData={fetchData} />,
    });
  }, [navigation, fetchData, final]);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusUnsubscribe;
  }, [navigation, fetchData]);

  useEffect(() => {
    setNavOptions();
  }, [setNavOptions]);

  const validationSchema = Yup.object().shape({
    grade: Yup.number()
      .typeError('Grade must be a number')
      .integer('Grade must be an integer')
      .min(1, 'Grade must be greater than or equal to 1')
      .max(10, 'Grade must be less than or equal to 10')
      .required('Grade is required'),
  });

  const updateFinalExamGrade = async (exam: FinalExam, newGrade: string) => {
    const grade = Number(newGrade);

    if (newGrade === '') {
      return;
    }

    if (isNaN(grade) || grade < 1 || grade > 10) {
      Alert.alert('Error', 'La nota debe ser un número entre 1 y 10.');
      return;
    }

    try {
      const response = await finalRepository.grade(final.id, [{ finalExamSubmissionId: exam.id, grade }]);
      ToastAndroid.show(`La calificación de ${exam.student.firstName} ${exam.student.lastName} ha sido guardada exitosamente`, ToastAndroid.LONG);
      console.log("Response after grading", response);
      
      fetchData();
    } catch (error) {
      Alert.alert("Error", "Hubo un error al guardar la calificación");
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Estudiante</Text>
      <Text style={styles.headerText}>Nota</Text>
    </View>
  );

  const editingCondition = (): boolean => {
    return final.teacher === userData?.id;
  };

  const handleEditGrade = (exam: FinalExam) => {
    if (editingCondition()) {
      setEditingGrade(exam.student.id);
      setGradeText(exam.grade?.toString() || '');
    }
  };

  const handleBlur = (exam: FinalExam) => {
    updateFinalExamGrade(exam, gradeText);
    setEditingGrade(null);
  };

  const renderItem = ({ item: exam }: { item: FinalExam }) => {
    const isEditable = editingCondition();
    return (
      <View style={[styles.row, !isEditable && styles.nonEditableRow]}>
        <Text style={styles.cell}>{`${exam.student.firstName} ${exam.student.lastName}`}</Text>
        <View style={styles.divider} />
        {editingGrade === exam.student.id ? (
          <TextInput
            style={styles.input}
            value={gradeText}
            onChangeText={setGradeText}
            onBlur={() => handleBlur(exam)}
            keyboardType="numeric"
            autoFocus
          />
        ) : (
          <Text
            style={[styles.cell, isEditable && styles.editableCell]}
            onPress={() => handleEditGrade(exam)}
          >
            {exam.grade?.toString() || ''}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.view}>
      {loading && <Loading />}
      {!loading && !finalExams.length && (
        <View style={styles.containerView}>
          <Text style={styles.text}>No se han registrado alumnos que hayan rendido.</Text>
        </View>
      )}
      {!loading && (
        <FlatList
          data={finalExams}
          keyExtractor={(exam) => exam.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          ListFooterComponent={<FinalExamSubmissionsListFooter final={final} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'space-around',
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  nonEditableRow: {
    backgroundColor: '#e0e0e0', // Light gray color for non-editable rows
  },
  cell: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  editableCell: {
    // textDecorationLine: 'underline',
    // color: 'blue',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff', // Make the input visible
  },
});

export default FinalExamSubmissions;
