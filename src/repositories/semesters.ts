import moment from 'moment';
import { Evaluation } from '../models/Evaluation.ts';
import { Semester, SemesterSnakeCase } from '../models/Semester.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post } from './authenticatedRepository.ts';
import { ClassAttendanceSnakeCase } from '../models/ClassAttendance.ts';
import { AddedStudentToSemester } from '../models/AddedStudentToSemester.ts';

const domainUrl = 'api/semesters';
const COMMISION_PRESENT_SEMESTER = `${domainUrl}/commission_present_semester`

const BASE_TEACHER_SEMESTER = `api/teacher/semesters`
const GET_ATTENDANCES = `${BASE_TEACHER_SEMESTER}/attendance`

export async function fetchPresentSemesterFromCommissionId(commissionId: number): Promise<Semester> {
  const presentSemester: SemesterSnakeCase = await get(COMMISION_PRESENT_SEMESTER, [{key: 'commission_id', value: commissionId}]) as SemesterSnakeCase; 
  return convertSnakeToCamelCase(presentSemester)
}

export async function createSemester(commissionId: number, yearMoment: string, startDate: Date, classesAmount: number | null, minimumAttendance: number | null) {
  const formattedDate = moment(startDate).format('YYYY-MM-DDTHH:mm-03:ss');
  console.log(formattedDate);
  
  const body = {
    "commission": commissionId,
    "year_moment": yearMoment,
    "start_date": formattedDate,
    "classes_amount": classesAmount,
    "minimum_attendance": minimumAttendance
  }
  const createdSemester: SemesterSnakeCase = await post(BASE_TEACHER_SEMESTER, body) as SemesterSnakeCase;
  return convertSnakeToCamelCase(createdSemester)
}

export async function getSemesterAttendances(semesterId: number) {
  const attendancesData = await get(GET_ATTENDANCES, [{ key: 'semester_id', value: semesterId}]) as ClassAttendanceSnakeCase
  return convertSnakeToCamelCase(attendancesData)
}

export async function addStudentToSemester(studentId: number, semesterId: number) {
  const bodyToSend = {
    student: studentId,
    semester: semesterId
  }
  console.log("About to add student to semester", bodyToSend);
  
  const addedStudent = await post(`api/teacher/commission_inscription/add_student`, bodyToSend) as AddedStudentToSemester
  return convertSnakeToCamelCase(addedStudent)
}

export default { fetchPresentSemesterFromCommissionId, createSemester, getSemesterAttendances, addStudentToSemester };
