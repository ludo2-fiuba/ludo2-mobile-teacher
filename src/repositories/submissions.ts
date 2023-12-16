import { Submission, SubmissionFromBackend } from '../models/Submission.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post, put } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/evaluations/submissions';
const GET_SUBMISSIONS_ENDPOINT = `${domainUrl}/get_submissions`;
const GRADE_SUBMISSION_ENDPOINT = `${domainUrl}/grade`;


// Get submissions
export async function getSubmissions(evaluationId: number): Promise<Submission[]> {
  const submissionsFromBackend: SubmissionFromBackend[] = await get(`${GET_SUBMISSIONS_ENDPOINT}`, [{key: 'evaluation', value: evaluationId}]) as SubmissionFromBackend[]; 
  const submissions: Submission[] = [];

  for (const submission of submissionsFromBackend) {
    submissions.push(convertSnakeToCamelCase(submission) as Submission);
  }

  return submissions;
}

export async function gradeSubmission(studentId: number, evaluationId: number, grade: number) {
  await post(`${GRADE_SUBMISSION_ENDPOINT}`, {studentId, evaluationId, grade});
}

export default { getSubmissions };
