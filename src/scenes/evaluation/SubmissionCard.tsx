import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Submission } from '../../models/Submission';
import { gradeSubmission } from '../../repositories/submissions';
import { Evaluation } from '../../models/Evaluation';

interface Props {
  submission: Submission;
  evaluation: Evaluation;
}

export default function SubmissionCard({ submission, evaluation }: Props) {
  const [grade, setGrade] = useState((submission.grade || '').toString());


  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    gradeSubmission(submission.student.id, evaluation.id, +newGrade)
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{submission.student.lastName}</Text>
      <TextInput
        style={styles.input}
        value={grade}
        onChangeText={handleGradeChange}
        keyboardType="numeric" // for numeric input
        maxLength={3} // assuming the grade is out of 100
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white', // added for visibility
  },
  name: {
    color: 'black',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8,
    width: 60, // fixed width for the input
    borderRadius: 5, // rounded corners for the input
    textAlign: 'center', // center the text inside the input
    fontSize: 18,
    color: 'black',
  },
  // ... other styles if necessary
});
