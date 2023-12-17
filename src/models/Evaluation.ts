export interface Evaluation {
  id:            number;
  evaluationName: string;
  passingGrade:   number;
  startDate:      Date;
  endDate:        Date;
}

export interface EvaluationSnakeCase {
  id: number,
  evaluation_name: string;
  passing_grade:   number;
  start_date:      Date;
  end_date:        Date;
}