export interface Evaluation {
  id:            number;
  evaluationName: string;
  passingGrade:   number;
  startDate:      Date;
  endDate:        Date;
}

export interface EvaluationFromBackend {
  evaluation_name: string;
  passing_grade:   number;
  start_date:      Date;
  end_date:        Date;
}

export function parseEvaluationFromBackend(id: number, evaluation: EvaluationFromBackend): Evaluation {
  return {
    id:            id,
    evaluationName: evaluation.evaluation_name,
    passingGrade:   evaluation.passing_grade,
    startDate:      evaluation.start_date,
    endDate:        evaluation.end_date,
  };
}
