export interface CreateEvaluation {
  semester_id:     number;
  evaluation_name: string;
  is_graded:       boolean;
  passing_grade:   number;
  start_date:      Date;
  end_date:        Date;
}
