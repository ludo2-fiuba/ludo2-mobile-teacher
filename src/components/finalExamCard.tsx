import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {FinalExam, Student} from '../models';
import FormInput from './FormInput';
import {finalExamCard as style} from '../styles';

export interface FinalExamCardProps {
  exam: FinalExam;
  initialGrade?: number;
  disabled: boolean;
  onGradeChanged?: (grade?: number) => void;
  onGradeUnchanged?: (grade?: number) => void;
}

export default class FinalExamCard extends Component<FinalExamCardProps> {
  public static defaultProps = {
    exam: new FinalExam(
      0,
      0,
      new Student(
        '95557',
        'Estudiante',
        'de FIUBA',
        '10110100',
        'mail@fi.uba.ar',
      ),
      null,
      false,
    ),
    onGradeChanged: null,
    onGradeUnchanged: null,
    initialGrade: null,
  };

  render() {
    const {exam, initialGrade} = this.props;
    return (
      <View style={style().view}>
        <View style={style().studentInfo}>
          <Text style={style().padron}>{exam.student.studentId}</Text>
          <Text style={style().name}>
            {exam.student.lastName}, {exam.student.firstName}
          </Text>
        </View>
        <View style={style().gradeInfo}>
          <FormInput
            ref={(input: any) => {
              this.textInput = input;
            }}
            disabled={this.props.disabled}
            style={style().grade}
            placeholderColor={style().textInputPlaceholder.color}
            errorStyle={style().errorInInput}
            keyboardType="numeric"
            placeholder=""
            initialValue={exam.grade != null ? exam.grade.toString() : ''}
            blurOnSubmit={false}
            onTextChanged={(text, isValid) => {
              var newGrade;
              if (isValid && text) {
                newGrade = parseInt(text);
              } else {
                newGrade = null;
              }
              exam.grade = newGrade;
              if (newGrade == initialGrade) {
                if (this.props.onGradeUnchanged) {
                  this.props.onGradeUnchanged(newGrade);
                }
              } else {
                if (this.props.onGradeChanged) {
                  this.props.onGradeChanged(newGrade);
                }
              }
            }}
            validation={{
              numericality: {
                onlyInteger: true,
                lessThanOrEqualTo: 10,
                message: ' ',
              },
            }}
          />
          {!exam.hasAllCorrelatives && <Text style={style().warning}>⚠️</Text>}
        </View>
      </View>
    );
  }
}
