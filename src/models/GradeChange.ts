import { Evaluation, EvaluationSnakeCase } from "./Evaluation";
import { Student, StudentSnakeCase } from "./Student";
import { Teacher, TeacherSnakeCase } from "./Teachers";

export interface GradeChange {
  evaluation: Evaluation;
  student:    Student;
  grade:      number;
  corrector:  Teacher;
  createdAt:  Date;
  updatedAt:  Date;
}
export interface GradeChangeSnakeCase {
  evaluation: EvaluationSnakeCase;
  student:    StudentSnakeCase;
  grade:      number;
  corrector:  TeacherSnakeCase;
  created_at: Date;
  updated_at: Date;
}


