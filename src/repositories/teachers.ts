import { TeacherTuple, TeacherTupleSnakeCase } from '../models/Teachers.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/commissions/teachers';

export async function fetchTeachersOfCommission(commissionId: number): Promise<TeacherTuple[]> {
  const teachersList: TeacherTupleSnakeCase[] = await get(`${domainUrl}`, [{key: 'commission_id', value: commissionId}]) as TeacherTupleSnakeCase[]; 
  const parsedTeachersList: TeacherTuple[] = convertSnakeToCamelCase(teachersList)
  return parsedTeachersList
}

export default { fetchTeachersOfCommission };