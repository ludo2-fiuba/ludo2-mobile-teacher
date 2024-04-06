import React from 'react';
import { View, Text } from 'react-native';
import { finalExamCard as style } from '../styles';
import { Student } from '../models';

interface Props {
  student: Student
}

export function FinalExamSubmissionStudentCard({ student }: Props) {
  return (<View style={style().studentInfo}>
    <Text style={style().padron}>{student.padron}</Text>
    <Text style={style().name}>
      {student.lastName}, {student.firstName}
    </Text>
  </View>);
}
