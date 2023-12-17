import { GradeChange, GradeChangeSnakeCase } from '../models/GradeChange.ts';
import { Submission, SubmissionSnakeCase } from '../models/Submission.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post, put } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/evaluations/submissions';
const GET_SUBMISSIONS_ENDPOINT = `${domainUrl}/get_submissions`;
const GRADE_SUBMISSION_ENDPOINT = `${domainUrl}/grade`;


// Get submissions
export async function getSubmissions(evaluationId: number): Promise<Submission[]> {
  const submissionsSnakeCase: SubmissionSnakeCase[] = await get(`${GET_SUBMISSIONS_ENDPOINT}`, [{key: 'evaluation', value: evaluationId}]) as SubmissionSnakeCase[]; 
  
  const submissions: Submission[] = convertSnakeToCamelCase(submissionsSnakeCase) as Submission[];
  return submissions;
}

export async function gradeSubmission(studentId: number, evaluationId: number, grade: number): Promise<GradeChange> {
  const snakeCaseBody = {
    "student": studentId,
    "evaluation": evaluationId,
    "grade": grade
  }
  const gradeChange: GradeChangeSnakeCase = await put(`${GRADE_SUBMISSION_ENDPOINT}`, snakeCaseBody) as GradeChangeSnakeCase;
  return convertSnakeToCamelCase(gradeChange) as GradeChange;
}

export default { getSubmissions };
