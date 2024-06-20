import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Submission } from '../../models/Submission';
import { submissionsRepository, teachersRepository } from '../../repositories';
import { useNavigation } from '@react-navigation/native';
import { Evaluation } from '../../models/Evaluation';
import { SubmissionsHeaderRight } from './SubmissionsHeaderRight';
import { Loading } from '../../components';
import { Student, Teacher } from '../../models';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import { TeacherTuple } from '../../models/TeacherTuple';
import EntitySelectionModal from './EntitySelectionModal';
import { selectStaffTeachers } from '../../features/teachersSlice';
import { selectUserData } from '../../features/userDataSlice';

interface Props {
  route: any;
}

interface RouteParams {
  evaluation: Evaluation;
}

const EditableText = ({ value, onChange, editable }: { value: string, onChange: (text: string) => void, editable: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    const grade = Number(text);
    if (text === '') {
      return;
    }

    if (isNaN(grade) || grade < 1 || grade > 10) {
      Alert.alert('Error', 'La nota debe ser un número entre 1 y 10.');
      setText(value); // reset to original value
      return;
    }

    onChange(text);
  };

  return (
    <View style={styles.editableTextContainer}>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onBlur={handleBlur}
          autoFocus
          editable={editable}
        />
      ) : (
        <Text style={styles.text} onPress={() => editable && setIsEditing(true)}>
          {value}
        </Text>
      )}
    </View>
  );
};

export default function SubmissionsList({ route }: Props) {
  const navigation = useNavigation();
  const semester = useAppSelector(selectSemesterData);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [semesterTeachers, setSemesterTeachers] = useState<Teacher[]>([]);
  const [showTeacherSelectionModal, setShowTeacherSelectionModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { evaluation } = route.params as RouteParams;

  const teachersTuples: TeacherTuple[] = useAppSelector(selectStaffTeachers);
  const userData = useAppSelector(selectUserData);

  const isActualUserChiefTeacher = semester?.commission.chiefTeacher.id === userData?.id;

  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Entregas', // Set the screen title
      headerRight: () => <SubmissionsHeaderRight evaluation={evaluation} fetchData={fetchData} isActualUserChiefTeacher={isActualUserChiefTeacher}/>,
    });
  }, [navigation, evaluation]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let submissions: Submission[] = await submissionsRepository.getSubmissions(evaluation.id);
      submissions = submissions.sort((a, b) => a.student.lastName.localeCompare(b.student.lastName));

      if (semester) {
        // Getting only teachers
        const commissionTeachers = teachersTuples.map(actual => actual.teacher);
        // Add chief teacher
        commissionTeachers.push(semester.commission.chiefTeacher);
        // Set state
        setSemesterTeachers(commissionTeachers);
      }

      setSubmissions(submissions);
    } catch (error) {
      Alert.alert('Error', 'No pudimos conseguir información. Intenta nuevamente.');
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, [evaluation.id, isLoading]);

  const updateCorrectorToSubmission = (submission: Submission) => {
    if (submission.grade) {
      Alert.alert('Error', 'No se puede cambiar el corrector de una entrega ya calificada.');
      return;
    } else if (isActualUserChiefTeacher) {
      setSelectedStudent(submission.student);
      setShowTeacherSelectionModal(true);
    } else {
      // You should never get here
      Alert.alert('Error', 'No tiene permisos para cambiar el corrector de esta entrega.');
    }
  };

  const assignCorrectorToStudent = async (student: Student, newCorrector: Teacher) => {
    setShowTeacherSelectionModal(false);
    setSelectedStudent(null);

    try {
      await submissionsRepository.assignGraderToSubmission(student.id, evaluation.id, newCorrector.id);
      // force-refresh
      fetchData();
    } catch (error) {
      Alert.alert("Error", "Hubo un error al agregar el corrector");
    }
  };

  const updateSubmissionGrade = async (student: Student, newGrade: string) => {
    const res = await submissionsRepository.gradeSubmission(student.id, evaluation.id, +newGrade);
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission.student.id === student.id
          ? { ...submission, grade: newGrade, grader: res.grader }
          : submission
      )
    );
  };

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      setNavOptions();
      fetchData();
    });
    return focusUnsubscribe;
  }, [navigation, setNavOptions, fetchData]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Estudiante</Text>
      <Text style={styles.headerText}>Corrector</Text>
      <Text style={styles.headerText}>Nota</Text>
    </View>
  );

  const editingCondition = (submission: Submission): boolean => {
    return isActualUserChiefTeacher || submission.grader?.id === userData?.id || !submission.grader;
  };

  return (
    <View style={styles.view}>
      {isLoading && <Loading />}
      {!isLoading && (
        <FlatList
          data={submissions}
          keyExtractor={submission => submission.student.dni}
          ListHeaderComponent={renderHeader}
          renderItem={({ item: submission }) => {
            const isEditable = editingCondition(submission);
            return (
              <View style={[styles.row, !isEditable && styles.nonEditableRow]}>
                <Text style={styles.cell}>{`${submission.student.firstName} ${submission.student.lastName}`}</Text>
                <View style={styles.divider} />
                <TouchableOpacity 
                  style={styles.cell} 
                  disabled={!isActualUserChiefTeacher} 
                  onPress={() => updateCorrectorToSubmission(submission)}
                >
                  <Text style={styles.text}>{submission.grader?.lastName}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <EditableText
                  value={submission.grade || ''}
                  onChange={text => updateSubmissionGrade(submission.student, text)}
                  editable={isEditable}
                />
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.containerView}>
              <Text style={styles.text}>
                Aún no hay entregas para esta evaluación
              </Text>
            </View>
          )}
        />
      )}
      <EntitySelectionModal
        visible={showTeacherSelectionModal}
        entities={semesterTeachers}
        onSelect={(selectedTeacher: any) => {
          if (selectedStudent) {
            assignCorrectorToStudent(selectedStudent, selectedTeacher);
          }
        }}
        onClose={() => setShowTeacherSelectionModal(false)}
        title="Asignar corrector"
      />
    </View>
  );
}

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
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#ccc',
  },
  editableTextContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff', // Make the input visible
  },
});
