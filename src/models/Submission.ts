import { Student, StudentSnakeCase } from "./Student";

export interface Submission {
  student: Student;
  grade:   null;
}

export interface SubmissionSnakeCase {
  student: StudentSnakeCase;
  grade:   null;
}


