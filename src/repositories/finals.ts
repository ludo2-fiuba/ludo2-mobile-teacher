import {Final, FinalExam, Student} from '../models';
import {get, put, post, deleteMethod} from './authenticatedRepository.ts';
import {StatusCodeError} from '../networking';

const domainUrl = 'api/finals';

export class IdentityFail extends Error {
  constructor() {
    super('No eres quien dices ser.');
    this.name = 'IdentityValidationFail';
  }
}

export function fetchFromSubject(subjectId: number): Promise<Final[]> {
  return get(`${domainUrl}`, [
    {key: 'subject_siu_id', value: subjectId},
  ]).then(json =>
    Promise.resolve(
      json
        ? json.map(
            (data, index) =>
              new Final(
                data.id,
                data.subject.name,
                new Date(data.date),
                data.status,
                null,
                data.act,
              ),
          )
        : [],
    ),
  );
}

export function getDetail(finalId: number): Promise<Final> {
  console.log("Final id: ", finalId);
  
  return get(`${domainUrl}/${finalId}`).then(json =>
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

export function getFinalExamsFor(finalId: number): Promise<FinalExam> {
  return get(`${domainUrl}/${finalId}`).then(json =>
    Promise.resolve(
      json.final_exams
        ? json.final_exams.map(
            (data, index) =>
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
          )
        : [],
    ),
  );
}

export function grade(
  finalId: number,
  finalExams: FinalExam[],
): Promise<boolean> {
  var body = {};
  var grades = [];
  finalExams.forEach(exam => {
    grades.push({final_exam_id: exam.id, grade: exam.grade});
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
  getDetail,
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
