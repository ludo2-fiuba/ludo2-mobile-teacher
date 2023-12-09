import Student from './Student';

export interface FinalExam {
  id: number;
  finalId: number;
  student: Student;
  grade?: number;
  hasAllCorrelatives: boolean;
}