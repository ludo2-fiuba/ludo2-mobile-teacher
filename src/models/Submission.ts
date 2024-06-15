import { Student, StudentSnakeCase } from "./Student";
import { Teacher } from "./Teacher";

export interface Submission {
  student: Student;
  grade: string | null;
  grader:  Teacher | null;
}

export interface SubmissionSnakeCase {
  student: StudentSnakeCase;
  grade: string | null;
  grader:  Teacher | null;
}
