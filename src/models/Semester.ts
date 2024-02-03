import { CommissionSnakeCase, Commission } from "./Commission";
import { Evaluation, EvaluationSnakeCase } from "./Evaluation";
import { Student, StudentSnakeCase } from "./Student";

export interface Semester {
  id: number
  yearMoment: string
  startDate: Date;
  commission: Commission
  evaluations: Evaluation[];
  students: Student[];
}

export interface SemesterSnakeCase {
  id: number;
  year_moment: string;
  start_date: Date;
  commission: CommissionSnakeCase;
  evaluations: EvaluationSnakeCase[];
  students: StudentSnakeCase[];
}