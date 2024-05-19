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

interface Props {
  route: any;
}

interface RouteParams {
  evaluation: Evaluation;
}

const EditableText = ({ value, onChange }: { value: string, onChange: (text: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
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
        />
      ) : (
        <Text style={styles.text} onPress={() => setIsEditing(true)}>
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

  const setNavOptions = useCallback(() => {
    navigation.setOptions({
      title: 'Entregas', // Set the screen title
      headerRight: () => <SubmissionsHeaderRight evaluation={evaluation} />,
    });
  }, [navigation, evaluation]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let submissions: Submission[] = await submissionsRepository.getSubmissions(evaluation.id);
      submissions = submissions.sort((a, b) => a.student.lastName.localeCompare(b.student.lastName));
      console.log("Submissions", submissions);
      

      if (semester) {
        const teachersTuples: TeacherTuple[] = await teachersRepository.fetchTeachersOfCommission(semester.commission.id);
        const commissionTeachers = teachersTuples.map(actual => actual.teacher);
        commissionTeachers.push(semester.commission.chiefTeacher);
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

  const updateCorrector = (student: Student) => {
    setSelectedStudent(student);
    setShowTeacherSelectionModal(true);
  };

  const assignCorrectorToStudent = async (student: Student, newCorrector: Teacher) => {
    setShowTeacherSelectionModal(false);
    setSelectedStudent(null);

    try {
      await submissionsRepository.assignGraderToSubmission(student.id, evaluation.id, newCorrector.id);
      setSubmissions(prevSubmissions =>
        prevSubmissions.map(submission =>
          submission.student.id === student.id
            ? { ...submission, corrector: `${newCorrector.firstName} ${newCorrector.lastName}` }
            : submission
        )
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un error al agregar el corrector")
    }
  };

  const updateSubmissionGrade = async (student: Student, newGrade: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission.student.id === student.id
          ? { ...submission, grade: newGrade }
          : submission
      )
    );
    await submissionsRepository.gradeSubmission(student.id, evaluation.id, +newGrade);
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

  return (
    <View style={styles.view}>
      {isLoading && <Loading />}
      {!isLoading && (
        <FlatList
          data={submissions}
          keyExtractor={submission => submission.student.dni}
          ListHeaderComponent={renderHeader}
          renderItem={({ item: submission }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{`${submission.student.firstName} ${submission.student.lastName}`}</Text>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.cell} onPress={() => updateCorrector(submission.student)}>
                <Text style={styles.text}>{submission.corrector}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <EditableText
                value={submission.grade || ''}
                onChange={text => updateSubmissionGrade(submission.student, text)}
              />
            </View>
          )}
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
        title="Profesores de la comisión"
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
