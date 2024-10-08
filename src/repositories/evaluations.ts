import { CreatedEvaluation, CreatedEvaluationSnakeCase } from '../models/CreatedEvaluation.ts';
import { Evaluation } from '../models/Evaluation.ts';
import { Semester } from '../models/Semester.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { post } from './authenticatedRepository.ts';
import { fetchPresentSemesterFromCommissionId } from './semesters.ts';

const domainUrl = 'api/teacher/evaluations';

async function create(semester: Semester, evaluationName: string, startDate: Date, finishDate: Date, minimumPassingGrade: string): Promise<CreatedEvaluation> {
  const evaluationToBeCreated: CreatedEvaluationSnakeCase = {
    semester_id: semester.id,
    evaluation_name: evaluationName,
    is_graded: true,
    passing_grade: +minimumPassingGrade,
    start_date: startDate,
    end_date: finishDate
  }

  const response = await post(`${domainUrl}/add_evaluation`, evaluationToBeCreated)
  return convertSnakeToCamelCase(response) as CreatedEvaluation
}

export async function fetchPresentSemesterEvaluations(commissionId: number): Promise<Evaluation[]> {
  const presentSemester: Semester = await fetchPresentSemesterFromCommissionId(commissionId) as Semester;
  return presentSemester.evaluations
}


// To implement when evaluations contain grades and the backend supports adding students to evaluations
async function addSubmissionToEvaluation(evaluationId: number, studentId: number) {

  const studentToAdd = {
    evaluation: evaluationId,
    student: studentId,
    grade: null,
  }

  const data: any = await post(`${domainUrl}/submissions/add_evaluation_submission`, studentToAdd);
  return data;
}

async function notifyStudents(evaluationId: number): Promise<void> {
  await post(`${domainUrl}/${evaluationId}/notify_grades`, {})
  return;
}

export default { create, addSubmissionToEvaluation, fetchPresentSemesterEvaluations, notifyStudents }
