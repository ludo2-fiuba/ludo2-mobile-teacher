import moment from 'moment';
import { Evaluation } from '../models/Evaluation.ts';
import { Semester, SemesterSnakeCase } from '../models/Semester.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post } from './authenticatedRepository.ts';

const domainUrl = 'api/semesters';

export async function fetchPresentSemesterFromCommissionId(commissionId: number): Promise<Semester> {
  const presentSemester: SemesterSnakeCase = await get(`${domainUrl}/commission_present_semester`, [{key: 'commission_id', value: commissionId}]) as SemesterSnakeCase; 
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

  console.log("Body to push", body);
  console.log("Domain url", domainUrl);
  
  
  const createdSemester: SemesterSnakeCase = await post(`api/teacher/semesters`, body) as  SemesterSnakeCase;
  console.log("Created semester", createdSemester);
  return convertSnakeToCamelCase(createdSemester)
}

export default {fetchPresentSemesterFromCommissionId, createSemester};
