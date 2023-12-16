import { Student, StudentFromBackend, parseStudentFromBackend } from "./Student";

export interface Submission {
  student: Student;
  grade:   null;
}

export interface SubmissionFromBackend {
  student: StudentFromBackend;
  grade:   null;
}

// export function parseSubmissionFromBackend(submissionFromBackend: SubmissionFromBackend): Submission {
//   return {
//     student: parseStudentFromBackend(submissionFromBackend.student),
//     grade:   submissionFromBackend.grade,
//   };
// }


