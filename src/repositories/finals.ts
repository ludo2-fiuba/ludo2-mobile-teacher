import { Final } from '../models';
import { get, post, put } from './authenticatedRepository.ts';
import { StatusCodeError } from '../networking';
import { FinalCamelCase } from '../models/Final.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { FinalExam } from '../models/FinalExam.ts';

const domainUrl = 'api/finals';

export class IdentityFail extends Error {
  constructor() {
    super('No eres quien dices ser.');
    this.name = 'IdentityValidationFail';
  }
}

export async function fetchFromSubject(subjectId: number): Promise<any> {
  const response: FinalCamelCase[] = await get(`${domainUrl}`, [{ key: 'subject_siu_id', value: subjectId }]) as FinalCamelCase[]
  const allFinals = response.map((json: FinalCamelCase) => convertSnakeToCamelCase(json) as Final);

  // TODO: remove this
  // allFinals.forEach(final => final.status = FinalStatus.Grading);
  return allFinals
}

export async function getDetail(finalId: number): Promise<Final> {
  const finalData: FinalCamelCase = await get(`${domainUrl}/${finalId}`) as FinalCamelCase
  return convertSnakeToCamelCase(finalData) as Final;  
}

export async function grade(
  finalId: number,
  finalExams: { finalExamSubmissionId: number, grade: number }[],
): Promise<boolean> {
  var body = { grades: finalExams.map(exam => ({ final_exam_id: exam.finalExamSubmissionId, grade: exam.grade })) }
  console.log('body', body);
  
  await put(`${domainUrl}/${finalId}/grade`, body)
  return true
}

// export function deleteExam(
//   finalId: number,
//   finalExam: FinalExam,
// ): Promise<boolean> {
//   return deleteMethod(
//     `${domainUrl}/${finalId}/final_exams/${finalExam.id}`,
//   ).then(json => Promise.resolve(true));
// }

export async function addStudent(
  finalId: number,
  padron: number,
): Promise<FinalExam> {
  const finalExam = await post(`${domainUrl}/${finalId}/final_exams`, {
    padron: padron,
  })
  
  return convertSnakeToCamelCase(finalExam) as FinalExam;
  // then(data =>
  //   Promise.resolve(
  //     new FinalExam(
  //       data.id,
  //       finalId,
  //       new Student(
  //         data.student.padron,
  //         data.student.first_name,
  //         data.student.last_name,
  //         data.student.dni,
  //         data.student.email,
  //       ),
  //       data.grade,
  //       data.correlatives_approved,
  //     ),
  //   ),
  // );
}

export async function close(finalId: number, image: string): Promise<boolean> {
  await post(`${domainUrl}/${finalId}/close`, '')
  return true
}

export function sendAct(finalId: number, image: string): Promise<boolean> {
  return post(`${domainUrl}/${finalId}/send_act`, {
    image: `'${image}'`,
  })
    .catch(error => {
      if (
        error instanceof StatusCodeError &&
        error.isBecauseOf('invalid_image')
      ) {
        return Promise.reject(new IdentityFail());
      }
      return Promise.reject(error);
    })
    .then(json => Promise.resolve(true));
}

export async function createFinal(subjectId: number, subjectName: string, date: Date): Promise<Final> {
  console.log("Creating final", subjectId, subjectName);
  
  const createdFinal = await post(`${domainUrl}`, {
    subject_siu_id: subjectId,
    subject_name: subjectName,
    timestamp: Math.trunc(date.getTime() / 1000), // Transform milliseconds to seconds
  }) as FinalCamelCase
  return convertSnakeToCamelCase(createdFinal) as Final;
}

export function notifyGrades(finalId: number): Promise<boolean> {
  return post(`${domainUrl}/${finalId}/notify_grades`, '').then(json =>
    Promise.resolve(true),
  );
}

export default {
  fetchFromSubject,
  getDetail,
  grade,
  // deleteExam,
  // addStudent,
  close,
  sendAct,
  createFinal,
  notifyGrades,
  IdentityFail,
};
