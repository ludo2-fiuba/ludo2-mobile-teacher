import { CreateEvaluation } from '../models/CreateEvaluation.ts';
import { Evaluation } from '../models/Evaluation.ts';
import { Semester } from '../models/Semester.ts';
import { post } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/evaluations';

async function create(semester: Semester, evaluationName: string, startDate: Date, finishDate: Date): Promise<CreateEvaluation> {
  const evaluationToBeCreated: CreateEvaluation = {
    semester_id: semester.id,
    evaluation_name: evaluationName,
    is_graded: true,
    passing_grade: 4,
    start_date: startDate,
    end_date: finishDate
  } 

  return await post(`${domainUrl}`, evaluationToBeCreated) as unknown as CreateEvaluation
}

export default { create }
