import { Student } from "./Student";

// export default interface FinalExam {
//   id: number;
//   finalId: number;
//   student: Student;
//   grade?: number;
//   hasAllCorrelatives: boolean;
// }

export interface FinalExam {
  id:                    number;
  student:               Student;
  grade:                 number;
  correlativesApproved: boolean;
}

export interface FinalExamCamelCase {
  id:                    number;
  student:               Student;
  grade:                 number;
  correlatives_approved: boolean;
}