import {put} from './authenticatedRepository.ts';

const domainUrl = 'api/final_exams';

export function gradeExam(examId: string, grade: integer): Promise<Void> {
  return put(`${domainUrl}/${examId}/grade`, {grade});
}

export default {gradeExam};
