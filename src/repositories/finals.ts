import { Final, FinalExam, FinalStatus, Student } from '../models';
import { get, put, post, deleteMethod } from './authenticatedRepository.ts';
import { StatusCodeError } from '../networking';

const domainUrl = 'api/finals';

export class IdentityFail extends Error {
  constructor() {
    super('No eres quien dices ser.');
    this.name = 'IdentityValidationFail';
  }
}

export async function fetchFromSubject(subjectId: number): Promise<any> {
  const response = await get(`${domainUrl}`, [{ key: 'subject_siu_id', value: subjectId }]) as any[]

  const finals = response.map((json: any) => new Final(
    json.id,
    json.subject.name,
    new Date(json.date),
    // json.status,
    FinalStatus.Closed,
    json.qrid,
    json.act,
  ));
  

  return finals;
}

// export function getDetail(finalId: number): Promise<Final> {
//   console.log("Final id: ", finalId);

//   return get(`${domainUrl}/${finalId}`).then(json =>
//     Promise.resolve(
//       new Final(
//         json.id,
//         json.subject.name,
//         new Date(json.date),
//         json.status,
//         json.qrid,
//         json.act,
//       ),
//     ),
//   );
// }

export async function getFinalExamsFor(finalId: number): Promise<FinalExam[]> {
  try {
    const json = await get(`${domainUrl}/${finalId}`);
    if (json.final_exams) {
      return json.final_exams.map(data =>
        new FinalExam(
          data.id,
          finalId,
          new Student(
            data.student.padron,
            data.student.first_name,
            data.student.last_name,
            data.student.dni,
            data.student.email,
          ),
          data.grade,
          data.correlatives_approved,
        ),
      );
    }
    return [];
  } catch (error) {
    // Handle or rethrow error as needed
    console.error('Error fetching final exams:', error);
    throw error; // Rethrow if you want the caller to handle it
  }
}

export function grade(
  finalId: number,
  finalExams: FinalExam[],
): Promise<boolean> {
  var body = {};
  var grades = [];
  finalExams.forEach(exam => {
    grades.push({ final_exam_id: exam.id, grade: exam.grade });
  });
  body.grades = grades;
  return put(`${domainUrl}/${finalId}/grade`, body).then(json =>
    Promise.resolve(true),
  );
}

export function deleteExam(
  finalId: number,
  finalExam: FinalExam,
): Promise<boolean> {
  return deleteMethod(
    `${domainUrl}/${finalId}/final_exams/${finalExam.id}`,
  ).then(json => Promise.resolve(true));
}

export function addStudent(
  finalId: number,
  padron: number,
): Promise<boolean> {
  return post(`${domainUrl}/${finalId}/final_exams`, {
    padron: padron,
  }).then(data =>
    Promise.resolve(
      new FinalExam(
        data.id,
        finalId,
        new Student(
          data.student.padron,
          data.student.first_name,
          data.student.last_name,
          data.student.dni,
          data.student.email,
        ),
        data.grade,
        data.correlatives_approved,
      ),
    ),
  );
}

export function close(finalId: number, image: string): Promise<boolean> {
  return post(`${domainUrl}/${finalId}/close`, '').then(json =>
    Promise.resolve(true),
  );
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

export function create(subject: Subject, date: Date): Promise<Final> {
  return post(`${domainUrl}`, {
    subject_siu_id: subject.id,
    subject_name: subject.name,
    timestamp: Math.trunc(date.getTime() / 1000), // Transform milliseconds to seconds
  }).then(json =>
    Promise.resolve(
      new Final(
        json.id,
        json.subject.name,
        new Date(json.date),
        json.status,
        json.qrid,
        json.act,
      ),
    ),
  );
}

export function notifyGrades(finalId: number): Promise<boolean> {
  return post(`${domainUrl}/${finalId}/notify_grades`, '').then(json =>
    Promise.resolve(true),
  );
}

export default {
  fetchFromSubject,
  getFinalExamsFor,
  grade,
  deleteExam,
  addStudent,
  close,
  sendAct,
  create,
  notifyGrades,
  IdentityFail,
};
