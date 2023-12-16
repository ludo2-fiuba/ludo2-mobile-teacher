import { Evaluation } from "./Evaluation";
import { Student } from "./Student";
import { Teacher } from "./Teachers";

export interface GradeChange {
  evaluation: Evaluation;
  student:    Student;
  grade:      number;
  corrector:  Teacher;
  created_at: Date;
  updated_at: Date;
}


