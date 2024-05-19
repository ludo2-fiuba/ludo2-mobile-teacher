import { Student, StudentSnakeCase } from "./Student";

export interface Submission {
  student: Student;
  grade: string | null;
  corrector: string
}

export interface SubmissionSnakeCase {
  student: StudentSnakeCase;
  grade: string | null;
  corrector: string
}


