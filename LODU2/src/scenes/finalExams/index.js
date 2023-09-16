import React from 'react';
import AuthenticatedComponent from '../authenticatedComponent';
import {View, Text, FlatList, Alert, TouchableOpacity} from 'react-native';
import prompt from 'react-native-prompt-android';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {FinalExamCard, Loading, RoundedButton} from '../../components';
import {finalExams as style} from '../../styles';
import {finalRepository} from '../../repositories';
import {StatusCodeError} from '../../networking';
import {Final, FinalStatus} from '../../models';
import FacePictureConfiguration from './face_recognition';

Icon.loadFont();

export default class FinalExamsList extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      finalExams: [], //  [[exam, initialGrade]]
      gradeChanges: {},
      gradeLoading: false,
      showSave: {show: false, enabled: false},
      showNotify: {show: false, enabled: false},
      deletionsInProgress: 0,
    };
    this.final = null;
  }

  componentDidMount() {
    this.fetchData();
    this.setNavOptions();
  }

  getFinal() {
    if (this.final) {
      return this.final;
    }
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.final
    ) {
      this.final = Final.fromObject(this.props.route.params.final);
    } else {
      this.final = this.props.final;
    }
    return this.final;
  }

  isEditable() {
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.editable != null &&
      this.props.route.params.editable !== undefined
    ) {
      return this.props.route.params.editable;
    }
    if (this.props.editable != null && this.props.editable !== undefined) {
      return this.props.editable;
    }
    return true;
  }

  fetchData() {
    if (this.state.loading) {
      return;
    }
    this.setState({
      loading: true,
      finalExams: [],
      gradeChanges: new Set(),
    });
    this.request(() => finalRepository.getFinalExamsFor(this.getFinal().id))
      .then(async exams => {
        const examsAndGrades = exams.map(exam => [exam, exam.grade]);
        this.setState({
          loading: false,
          finalExams: examsAndGrades,
        });
        if (examsAndGrades.length > 0) {
          this.addNotify(true);
        }
      })
      .catch(error => {
        this.setState({loading: false});
        Alert.alert(
          '¿Qué pasó?',
          'No sabemos pero no pudimos buscar los exámenes. ' +
            'Volvé a intentar en unos minutos.',
        );
        this.props.navigation.pop();
      });
  }

  gradeChanged(exam) {
    const {gradeChanges, gradeLoading} = this.state;
    if (!gradeChanges.has(exam.id)) {
      if (gradeChanges.size === 0) {
        this.addSave(!gradeLoading);
      }
      gradeChanges.add(exam.id);
    }
  }

  gradeUnChanged(exam) {
    const {gradeChanges} = this.state;
    if (gradeChanges.has(exam.id)) {
      gradeChanges.delete(exam.id);
      if (gradeChanges.size === 0) {
        this.removeSave();
      }
    }
  }

  examEliminated(exam) {
    const existingFinalExams = this.state.finalExams;
    const previousDeletions = this.state.deletionsInProgress;
    const newFinalExams = existingFinalExams.filter(
      examAndGrade => examAndGrade[0].id !== exam.id,
    );
    this.setState({
      finalExams: newFinalExams,
      deletionsInProgress: previousDeletions + 1,
    });
    if (newFinalExams.length === 0) {
      this.removeNotify();
    }
    this.request(() => finalRepository.deleteExam(this.getFinal().id, exam))
      .then(() => {
        const newDeletions = this.state.deletionsInProgress - 1;
        this.setState({
          deletionsInProgress: newDeletions,
        });
      })
      .catch(error => {
        const newDeletions = this.state.deletionsInProgress - 1;
        var finalExams = this.state.finalExams;
        finalExams.push([exam, exam.grade]);
        this.setState({
          deletionsInProgress: newDeletions,
          finalExams: finalExams,
        });
        Alert.alert(
          'Te fallamos',
          'No pudimos eliminar este examen. ' +
            'Guardá tus cambios y volvé a intentar en unos minutos.',
        );
      });
  }

  async studentAdded(padron) {
    await this.request(() =>
      finalRepository.addStudent(this.getFinal().id, padron),
    )
      .then(async finalExam => {
        var finalExams = this.state.finalExams;
        finalExams.push([finalExam, finalExam.grade]);
        this.setState({finalExams});
        if (finalExams.length === 1) {
          this.addNotify(true);
        }
      })
      .catch(error => {
        this.setState({loading: false});
        if (error instanceof StatusCodeError && error.code === 404) {
          Alert.alert(
            'Alumno no encontrado',
            `Parece que no existe un alumno registrado con el padrón ${padron}.`,
          );
        } else {
          Alert.alert(
            '¿Qué pasó?',
            'No sabemos pero no pudimos agregar al alumno que pediste. ' +
              'Volvé a intentar en unos minutos.',
          );
        }
      });
  }

  addSave(enabled) {
    this.setState({showSave: {show: true, enabled}}, () =>
      this.setNavOptions(),
    );
  }

  removeSave() {
    this.setState({showSave: {show: false, enabled: false}}, () =>
      this.setNavOptions(),
    );
  }

  addNotify(enabled) {
    if (this.getFinal().currentStatus() !== FinalStatus.Closed) {
      this.setState({showNotify: {show: true, enabled}}, () =>
        this.setNavOptions(),
      );
    }
  }

  removeNotify() {
    this.setState({show: false, enabled: false}, () => this.setNavOptions());
  }

  setNavOptions() {
    const {showSave, showNotify} = this.state;
    var saveOpacityStyle = {...style().navButton};
    var notifyOpacityStyle = {...style().navButton};
    if (!showSave.enabled) {
      saveOpacityStyle.opacity = 0.5;
    }
    if (!showNotify.enabled) {
      notifyOpacityStyle.opacity = 0.5;
    }
    const navOptions = {
      headerRight: navigation => (
        <View style={style().navButtonsContainer}>
          {showNotify.show && (
            <TouchableOpacity
              style={notifyOpacityStyle}
              disabled={!showNotify.enabled}
              onPress={() => this.notifyGrades()}>
              <Icon style={style().navButtonIcon} name="notifications" />
            </TouchableOpacity>
          )}

          {showSave.show && (
            <TouchableOpacity
              style={saveOpacityStyle}
              disabled={!showSave.enabled}
              onPress={() => this.saveChanges()}>
              <Icon style={style().navButtonIcon} name="save" />
            </TouchableOpacity>
          )}
        </View>
      ),
    };
    this.props.navigation.setOptions(navOptions);
  }

  canCloseAct(examsAndGrades) {
    const result = examsAndGrades.reduce((canUntilNow, exam) => {
      var hasGrade = false;
      if (exam[0].grade != null) {
        hasGrade = true;
      }
      return canUntilNow && hasGrade;
    }, true);
    return result;
  }

  saveChanges(onSuccess) {
    this.setState({gradeLoading: true});
    this.addSave(false);
    this.request(() =>
      finalRepository.grade(
        this.getFinal().id,
        this.state.finalExams.map(examAndInitialGrade => {
          return examAndInitialGrade[0];
        }),
      ),
    )
      .then(async () => {
        const exams = this.state.finalExams.map(examAndInitialGrade => {
          const exam = examAndInitialGrade[0];
          return [exam, exam.grade];
        });
        this.setState({
          gradeLoading: false,
          finalExams: exams,
        });
        this.state.gradeChanges.clear();
        this.removeSave();
        if (onSuccess) {
          await onSuccess();
        }
      })
      .catch(error => {
        this.setState({gradeLoading: false});
        Alert.alert(
          '¿Qué pasó?',
          'No sabemos pero no pudimos guardar tus cambios. ' +
            'Te pedimos perdón, pero por ahora anotá tus cambios en otro lado ' +
            'y volvé a cargarlos en otro momento.',
        );
        this.addSave(this.state.gradeChanges.size > 0);
      });
  }

  notifyGrades() {
    this.addNotify(false);
    this.request(() => finalRepository.notifyGrades(this.getFinal().id))
      .then(async () => {
        this.addNotify(true);
        Alert.alert(
          'Notificados',
          'Todos los alumnos con nota han sido notificados.',
        );
      })
      .catch(error => {
        this.addNotify(true);
        Alert.alert(
          'Lo siento',
          'No pudimos enviar las notificaciones, intentá de nuevo en unos minutos.',
        );
      });
  }

  async closeAct(navigation) {
    navigation.navigate('TakePicture', {
      configuration: new FacePictureConfiguration(
        this.getFinal().id,
      ).toObject(),
      title: 'Pre-registro',
    });
  }

  hasWarnings() {
    return this.state.finalExams.some(
      examAndGrade => !examAndGrade[0].hasAllCorrelatives,
    );
  }

  render() {
    const {navigation} = this.props;
    const {loading, finalExams, gradeLoading, deletionsInProgress} = this.state;
    const ableToCloseAct = this.canCloseAct(finalExams);
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
          <FlatList
            contentContainerStyle={style().list}
            data={finalExams}
            keyExtractor={exam => exam[0].id.toString()}
            renderItem={({item}) => (
              <Swipeout
                right={[
                  {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => this.examEliminated(item[0]),
                  },
                ]}>
                <FinalExamCard
                  disabled={gradeLoading || !this.isEditable()}
                  exam={item[0]}
                  initialGrade={item[1]}
                  onGradeChanged={() => this.gradeChanged(item[0])}
                  onGradeUnchanged={() => this.gradeUnChanged(item[0])}
                />
              </Swipeout>
            )}
            ListFooterComponent={() => {
              if (this.isEditable()) {
                return (
                  <View style={style().listHeaderFooter}>
                    <RoundedButton
                      text="Agregar alumno"
                      style={style().button}
                      enabled={!gradeLoading}
                      onPress={async () => {
                        prompt(
                          'Padrón del alumno',
                          '',
                          [
                            {
                              text: 'Cancelar',
                              style: 'cancel',
                            },
                            {
                              text: 'Agregar',
                              onPress: async padron => {
                                this.studentAdded(parseInt(padron));
                              },
                            },
                          ],
                          'plain-text',
                          '',
                          'number-pad',
                        );
                      }}
                    />
                    <View />
                    {this.hasWarnings() && (
                      <Text style={style().disclaimer}>
                        ⚠️ significa que el alumno necesita aprobar las
                        correlativas a esta materia aún.
                      </Text>
                    )}
                    <RoundedButton
                      text="Cerrar el Acta"
                      style={style().button}
                      enabled={
                        !loading &&
                        ableToCloseAct &&
                        !gradeLoading &&
                        !deletionsInProgress
                      }
                      onPress={async () => {
                        if (this.state.gradeChanges.size > 0) {
                          Alert.alert(
                            '¡Esperá!',
                            'Todavía tenés cambios sin guardar. ¿Qué querés hacer con ellos antes de cerrar el acta?',
                            [
                              {
                                text: 'Cancelar',
                                style: 'cancel',
                              },
                              {
                                text: 'Descartar',
                                onPress: () => this.closeAct(navigation),
                                style: 'destructive',
                              },
                              {
                                text: 'Guardar',
                                onPress: async () => {
                                  await this.saveChanges(async () => {
                                    await this.closeAct(navigation);
                                  });
                                },
                              },
                            ],
                            {
                              cancelable: true,
                            },
                          );
                          return;
                        } else if (this.hasWarnings()) {
                          Alert.alert(
                            '¡Esperá!',
                            'Tenés algunos alumnos que no tienen todas las correlativas. ¿Estás seguro que querés cerrar el acta con sus notas?',
                            [
                              {
                                text: 'Cancelar',
                                style: 'cancel',
                              },
                              {
                                text: 'Sí',
                                onPress: async () => {
                                  await this.closeAct(navigation);
                                },
                              },
                            ],
                            {
                              cancelable: true,
                            },
                          );
                          return;
                        } else {
                          await this.closeAct(navigation);
                        }
                      }}
                    />
                  </View>
                );
              } else {
                return null;
              }
            }}
          />
        )}
      </View>
    );
  }
}
