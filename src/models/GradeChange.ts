import { Teacher } from ".";
import { Evaluation, EvaluationSnakeCase } from "./Evaluation";
import { Student, StudentSnakeCase } from "./Student";
import { TeacherSnakeCase } from "./Teacher";

export interface GradeChange {
  evaluation: Evaluation;
  student: Student;
  grade: number;
  grader: Teacher;
  createdAt: Date;
  updatedAt: Date;
}
export interface GradeChangeSnakeCase {
  evaluation: EvaluationSnakeCase;
  student: StudentSnakeCase;
  grade: number;
  grader: TeacherSnakeCase;
  created_at: Date;
  updated_at: Date;
}
