import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { finalExamCard as style } from '../../styles';
import FinalExam from '../../models/FinalExam';
import { FormInput } from '../../components';

interface FinalExamCardProps {
  exam: FinalExam;
  initialGrade?: number;
  disabled: boolean;
  onGradeChanged?: (grade?: number) => void;
  onGradeUnchanged?: (grade?: number) => void;
}

const FinalExamCard: React.FC<FinalExamCardProps> = ({
  exam,
  initialGrade = null,
  disabled,
  onGradeChanged = () => {},
  onGradeUnchanged = () => {},
}) => {
  const textInputRef = useRef<any>(null); // Adjust the type according to FormInput ref type

  return (
    <View style={style().view}>
      <View style={style().studentInfo}>
        <Text style={style().padron}>{exam.student.id}</Text>
        <Text style={style().name}>
          {exam.student.lastName}, {exam.student.firstName}
        </Text>
      </View>
      <View style={style().gradeInfo}>
        <FormInput
          ref={textInputRef}
          disabled={disabled}
          style={style().grade}
          placeholderColor={style().textInputPlaceholder.color}
          errorStyle={style().errorInInput}
          keyboardType="numeric"
          placeholder=""
          initialValue={exam.grade != null ? exam.grade.toString() : ''}
          blurOnSubmit={false}
          onTextChanged={(text, isValid) => {
            let newGrade: number | null = null;
            if (isValid && text) {
              newGrade = parseInt(text);
            }
            exam.grade = newGrade || 0;
            if (newGrade === initialGrade) {
              onGradeUnchanged(newGrade || 0);
            } else {
              onGradeChanged(newGrade || 0);
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
};

export default FinalExamCard;