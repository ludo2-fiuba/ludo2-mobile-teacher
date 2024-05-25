import { Student, StudentSnakeCase } from "./Student";

export interface Submission {
  student: Student;
  grade: string | null;
  grader:  Student | null;
}

export interface SubmissionSnakeCase {
  student: StudentSnakeCase;
  grade: string | null;
  grader:  Student | null;
}


