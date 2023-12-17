import { CommissionSnakeCase, Commission } from "./Commission";
import { Evaluation, EvaluationSnakeCase } from "./Evaluation";

export interface Semester {
  id: number
  yearMoment: string
  startDate: Date;
  commission: Commission
  evaluations: Evaluation[];
}

export interface SemesterSnakeCase {
  id: number;
  year_moment: string;
  start_date: Date;
  commission: CommissionSnakeCase;
  evaluations: EvaluationSnakeCase[];
}