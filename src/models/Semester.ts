import { CommissionFromBackend, Commission, parseComissionFromBackend } from "./Commission";
import { Evaluation, EvaluationFromBackend, parseEvaluationFromBackend } from "./Evaluation";

export interface Semester {
  id: number
  yearMoment: string
  startDate: Date;
  comission: Commission
  evaluations: Evaluation[];
}

export interface SemesterFromBackend {
  id: number;
  year_moment: string;
  start_date: Date;
  commission: CommissionFromBackend;
  evaluations: EvaluationFromBackend[];
}

export function parseSemesterFromBackend(semester: SemesterFromBackend): Semester {
  return {
    id: semester.id,
    yearMoment: semester.year_moment,
    startDate: semester.start_date,
    comission: parseComissionFromBackend(semester.commission),
    evaluations: semester.evaluations.map((evaluation: EvaluationFromBackend, index) => {
      return parseEvaluationFromBackend(index, evaluation);
    }),
  }
}