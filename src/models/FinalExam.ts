import Student from './Student';

export default interface FinalExam {
  id: number;
  finalId: number;
  student: Student;
  grade?: number;
  hasAllCorrelatives: boolean;
}