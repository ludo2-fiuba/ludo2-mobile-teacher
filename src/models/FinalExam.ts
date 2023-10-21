import Student from './Student.ts';

export default class FinalExam {
  readonly id: integer;
  readonly finalId: integer;
  readonly student: Student;
  readonly grade?: integer;
  readonly hasAllCorrelatives: boolean;

  constructor(
    id: integer,
    finalId: integer,
    student: Student,
    grade?: integer,
    hasAllCorrelatives: boolean,
  ) {
    this.id = id;
    this.finalId = finalId;
    this.student = student;
    this.grade = grade;
    this.hasAllCorrelatives = hasAllCorrelatives;
  }
}
