import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EvaluationCard, Loading } from '../../components';
import { evaluationGradesList as style } from '../../styles';
// import { finalRepository } from '../../repositories';
import { Final, FinalStatus } from '../../models';
import FacePictureConfiguration from '../finalExams/face_recognition';
import { makeRequest } from '../../networking/makeRequest';
import ListFooter from '../finalExams/ListFooter';
import { EvaluationGradesListHeaderRightTest } from './EvaluationGradesListHeaderRightTest';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Submission } from '../../models/Submission';
import { getSubmissions } from '../../repositories/submissions';
import SubmissionCard from './SubmissionCard';

Icon.loadFont();

interface Props {
  route?: { params?: { final?: Final, editable?: boolean } },
  final?: Final,
  editable?: boolean,
  navigation: any,
};


const EvaluationGradesListTest: React.FC<Props> = ({ route, final: propFinal, editable: propEditable, navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradeChanges, setGradeChanges] = useState<Set<any>>(new Set());
  const [gradeLoading, setGradeLoading] = useState<boolean>(false);
  const [showSave, setShowSave] = useState<{ show: boolean, enabled: boolean }>({ show: false, enabled: false });
  const [showNotify, setShowNotify] = useState<{ show: boolean, enabled: boolean }>({ show: false, enabled: false });
  const [deletionsInProgress, setDeletionsInProgress] = useState<number>(0);
  const [final, setFinal] = useState<Final>(route?.params?.final || {} as Final);

  useEffect(() => {
    fetchData();
    setNavOptions();
    if (route?.params?.final) {
      const routeParams: any = route.params
      const finalFromObject = Final.fromObject(routeParams.final);
      setFinal(finalFromObject);
    } else {
      setFinal(propFinal || {} as Final);
    }
  }, []);

  // Previous GetFinal method, now the value is always updated when on change
  useEffect(() => {
    let finalValue;
    if (route && route.params && route.params.final) {
      const routeParams: any = route.params
      finalValue = Final.fromObject(routeParams.final);
    } else {
      finalValue = propFinal || {} as Final;
    }
    setFinal(finalValue);

  }, [route, propFinal]);

  useEffect(() => {
    setNavOptions()
  }, [showSave, showNotify])
  

  const isEditable = (): boolean => {
    if (route?.params?.editable != null) {
      return route.params.editable;
    }
    if (propEditable != null) {
      return propEditable;
    }
    return true;
  };

  const fetchData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setSubmissions([]);
    setGradeChanges(new Set());

    try {
      console.log("Dead archive");
      
    } catch (error) {
      console.error("Error fetching data", error);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos conseguir información acerca del semestre. ' +
        'Volvé a intentar en unos minutos.',
      );
      setLoading(false);
      navigation.pop();
    }

    // makeRequest(() => finalRepository.getFinalExamsFor(final.id), navigation)
    // .then(async (exams: any[]) => {
    //   const examsAndGrades = exams.map(exam => [exam, exam.grade]);
    //   setLoading(false);
    //   setFinalExams(examsAndGrades);
    //   if (examsAndGrades.length > 0) {
    //     addNotify(true);
    //   }
    // })
    // .catch((error: string) => {
    //   setLoading(false);
    //   Alert.alert(
    //     '¿Qué pasó?',
    //     'No sabemos pero no pudimos buscar los exámenes. ' +
    //       'Volvé a intentar en unos minutos.',
    //   );
    //   navigation.pop();
    // });
  };

  const addSave = (enabled: boolean) => {
    setShowSave({ show: true, enabled });
  };
  
  const removeSave = () => {
    setShowSave({ show: false, enabled: false });
  };

  const addNotify = (enabled: boolean) => {
    const finalClass = new Final(final.id, final.subjectName, final.date, final.status, final.qrId, final.act)
    if (finalClass?.currentStatus() !== FinalStatus.Closed) {
      setShowNotify({ show: true, enabled });
    }
  };
  
  const removeNotify = () => {
    setShowNotify({ show: false, enabled: false });
  };

  const setNavOptions = () => {
    const navOptions = {
      headerRight: () => (
        <EvaluationGradesListHeaderRightTest
          showNotify={showNotify}
          showSave={showSave}
          notifyGrades={notifyGrades}
          saveChanges={saveChanges}
        />
      ),
    };
    navigation.setOptions(navOptions);
  };

  const canCloseAct = (examsAndGrades: Array<any>) => {
    const result = examsAndGrades.reduce((canUntilNow, evaluation) => {
      var hasGrade = false;
      if (evaluation.grade != null) {
        hasGrade = true;
      }
      return canUntilNow && hasGrade;
    }, true);
    return result;
  }

  const saveChanges = (onSuccess?: any) => {
    setGradeLoading(true);
    addSave(false);
    // const finalExamsMap: FinalExam[] = evaluationGrades.map((examAndInitialGrade: any) => {
    //   return examAndInitialGrade[0];
    // })
    // makeRequest(() => finalRepository.grade(final.id, finalExamsMap), navigation)
    //   .then(async () => {
    //     const exams = finalExams.map(examAndInitialGrade => {
    //       const exam = examAndInitialGrade[0];
    //       return [exam, exam.grade];
    //     });
    //     setGradeLoading(false);
    //     setFinalExams(exams);
    //     gradeChanges.clear();
    //     removeSave();
    //     Alert.alert('Notas guardadas con éxito');
    //     if (onSuccess) {
    //       await onSuccess();
    //     }
    //   })
    //   .catch((error: string) => {
    //     setGradeLoading(false)
    //     console.log("Error", error);
        
    //     Alert.alert(
    //       '¿Qué pasó?',
    //       'No sabemos pero no pudimos guardar tus cambios. ' +
    //         'Te pedimos perdón, pero por ahora anotá tus cambios en otro lado ' +
    //         'y volvé a cargarlos en otro momento.',
    //     );
    //     addSave(gradeChanges.size > 0);
    //   });
  }

  const notifyGrades = () => {
    addNotify(false);
    // makeRequest(() => finalRepository.notifyGrades(final.id), navigation)
    //   .then(async () => {
    //     addNotify(true);
    //     Alert.alert(
    //       'Notificados',
    //       'Todos los alumnos con nota han sido notificados.',
    //     );
    //   })
    //   .catch((e: string) => {
    //     addNotify(true);
    //     Alert.alert(
    //       'Lo siento',
    //       'No pudimos enviar las notificaciones, intentá de nuevo en unos minutos.',
    //     );
    //   });
  }

  const closeAct = async () => {
    navigation.navigate('TakePicture', {
      configuration: new FacePictureConfiguration(final?.id || '').toObject(),
      title: 'Pre-registro',
    });
  }

  const hasWarnings = () => {
    return false
    // return evaluationGrades.some(evaluation => !evaluation[0].hasAllCorrelatives);
  };

  return (
    <View style={style().view}>
    {loading && <Loading />}
    {!loading && !submissions.length && (
      <View style={style().containerView}>
        <Text style={style().text}>
          No se han registrado alumnos que hayan rendido.
        </Text>
      </View>
    )}
    {!loading && (
      <SwipeListView
        data={submissions}
        keyExtractor={submission => submission.student.dni}
        renderItem={({ item: submission }) => (
          // <EvaluationCard
          //   disabled={gradeLoading || !isEditable()}
          //   evaluation={evaluation}
          //   initialGrade={evaluation[1]}
          // />
          <SubmissionCard
            submission={submission}
          />
        )}
        renderHiddenItem={({ item }, rowMap) => (
          <View>
            {/* <View style={style().rowBack}> */}
            <Text
              // style={style().backTextWhite}
              onPress={() => examEliminated(item[0])}
            >
              Delete
            </Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
        ListFooterComponent={() => (
          <ListFooter
            isEditable={isEditable()}
            gradeLoading={gradeLoading}
            hasWarnings={hasWarnings}
            ableToCloseAct={canCloseAct(submissions)}
            deletionsInProgress={deletionsInProgress > 0}
            loading={loading}
            saveChanges={saveChanges}
            closeAct={closeAct}
            getFinal={() => final}
            setFinalExams={setSubmissions}
            setLoading={setLoading}
            addNotify={addNotify}
            finalExams={submissions}
            gradeChanges={gradeChanges}
          />
        )}
      />
    )}
  </View>
  );
};

export default EvaluationGradesListTest;
