import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FinalExamCard, Loading } from '../../components';
import { finalExams as style } from '../../styles';
import { finalRepository } from '../../repositories';
import { Final, FinalExam, FinalStatus } from '../../models';
import FacePictureConfiguration from './face_recognition';
import { makeRequest } from '../../networking/makeRequest';
import ListFooter from './ListFooter';
import { HeaderRight } from './HeaderRight';
import { SwipeListView } from 'react-native-swipe-list-view';

Icon.loadFont();

interface Props {
  route?: { params?: { final?: Final, editable?: boolean } },
  final?: Final,
  editable?: boolean,
  navigation: any,
};

const FinalExamsList: React.FC<Props> = ({ route, final: propFinal, editable: propEditable, navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [finalExams, setFinalExams] = useState<Array<any>>([]);
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
    setFinalExams([]);
    setGradeChanges(new Set());

    makeRequest(() => finalRepository.getFinalExamsFor(final.id), navigation)
    .then(async (exams: any[]) => {
      const examsAndGrades = exams.map(exam => [exam, exam.grade]);
      setLoading(false);
      setFinalExams(examsAndGrades);
      if (examsAndGrades.length > 0) {
        addNotify(true);
      }
    })
    .catch((error: string) => {
      setLoading(false);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar los exámenes. ' +
          'Volvé a intentar en unos minutos.',
      );
      navigation.pop();
    });
  };

  const gradeChanged = (exam: any) => {
    if (!gradeChanges.has(exam.id)) {
      if (gradeChanges.size === 0) {
        addSave(!gradeLoading);
      }
      setGradeChanges(prev => new Set(prev).add(exam.id));
    }
  };
  
  const gradeUnChanged = (exam: any) => {
    if (gradeChanges.has(exam.id)) {
      setGradeChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(exam.id);
        return newSet;
      });
      if (gradeChanges.size === 0) {
        removeSave();
      }
    }
  };

  const examEliminated = (exam: any) => {
    const existingFinalExams = finalExams;
    const previousDeletions = deletionsInProgress;
    const newFinalExams = existingFinalExams.filter(
      examAndGrade => examAndGrade[0].id !== exam.id,
    );

    setFinalExams(newFinalExams);
    setDeletionsInProgress(previousDeletions + 1);
    if (newFinalExams.length === 0) {
      removeNotify();
    }
    makeRequest(() => finalRepository.deleteExam(final.id, exam), navigation)
      .then(() => {
        setDeletionsInProgress((prev) => prev - 1);
      })
      .catch((error: string) => {
        const newDeletions = deletionsInProgress - 1;
        setDeletionsInProgress(newDeletions);
        setFinalExams(prev => [...prev, [exam, exam.grade]]);
        Alert.alert(
          'Te fallamos',
          'No pudimos eliminar este examen. ' +
            'Guardá tus cambios y volvé a intentar en unos minutos.',
        );
      });
  }
  
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
        <HeaderRight
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
    const result = examsAndGrades.reduce((canUntilNow, exam) => {
      var hasGrade = false;
      if (exam[0].grade != null) {
        hasGrade = true;
      }
      return canUntilNow && hasGrade;
    }, true);
    return result;
  }

  const saveChanges = (onSuccess?: any) => {
    setGradeLoading(true);
    addSave(false);
    const finalExamsMap: FinalExam[] = finalExams.map((examAndInitialGrade: any) => {
      return examAndInitialGrade[0];
    })
    makeRequest(() => finalRepository.grade(final.id, finalExamsMap), navigation)
      .then(async () => {
        const exams = finalExams.map(examAndInitialGrade => {
          const exam = examAndInitialGrade[0];
          return [exam, exam.grade];
        });
        setGradeLoading(false);
        setFinalExams(exams);
        gradeChanges.clear();
        removeSave();
        Alert.alert('Notas guardadas con éxito');
        if (onSuccess) {
          await onSuccess();
        }
      })
      .catch((error: string) => {
        setGradeLoading(false)
        console.log("Error", error);
        
        Alert.alert(
          '¿Qué pasó?',
          'No sabemos pero no pudimos guardar tus cambios. ' +
            'Te pedimos perdón, pero por ahora anotá tus cambios en otro lado ' +
            'y volvé a cargarlos en otro momento.',
        );
        addSave(gradeChanges.size > 0);
      });
  }

  const notifyGrades = () => {
    addNotify(false);
    makeRequest(() => finalRepository.notifyGrades(final.id), navigation)
      .then(async () => {
        addNotify(true);
        Alert.alert(
          'Notificados',
          'Todos los alumnos con nota han sido notificados.',
        );
      })
      .catch((e: string) => {
        addNotify(true);
        Alert.alert(
          'Lo siento',
          'No pudimos enviar las notificaciones, intentá de nuevo en unos minutos.',
        );
      });
  }

  const closeAct = async () => {
    navigation.navigate('TakePicture', {
      configuration: new FacePictureConfiguration(final?.id || '').toObject(),
      title: 'Pre-registro',
    });
  }

  const hasWarnings = () => {
    return finalExams.some(examAndGrade => !examAndGrade[0].hasAllCorrelatives);
  };

  return (
    <View style={style().view}>
    {loading && <Loading />}
    {!loading && !finalExams.length && (
      <View style={style().containerView}>
        <Text style={style().text}>
          No se han registrado alumnos que hayan rendido.
        </Text>
      </View>
    )}
    {!loading && (
      <SwipeListView
        data={finalExams}
        keyExtractor={exam => exam[0].id.toString()}
        renderItem={({ item }) => (
          <FinalExamCard
            disabled={gradeLoading || !isEditable()}
            exam={item[0]}
            initialGrade={item[1]}
            onGradeChanged={() => gradeChanged(item[0])}
            onGradeUnchanged={() => gradeUnChanged(item[0])}
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
            ableToCloseAct={canCloseAct(finalExams)}
            deletionsInProgress={deletionsInProgress > 0}
            loading={loading}
            saveChanges={saveChanges}
            closeAct={closeAct}
            getFinal={() => final}
            setFinalExams={setFinalExams}
            setLoading={setLoading}
            addNotify={addNotify}
            finalExams={finalExams}
            gradeChanges={gradeChanges}
          />

        )}
      />
    )}
  </View>
  );
};

export default FinalExamsList;
