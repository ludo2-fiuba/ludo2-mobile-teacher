import { TeacherTuple, TeacherTupleFromBackend, parseTeacherTupleFromBackend } from '../models/Teachers.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/commissions/teachers';

export async function fetchTeachersOfCommission(commissionId: number): Promise<TeacherTuple[]> {
  const teachersList: TeacherTupleFromBackend[] = await get(`${domainUrl}`, [{key: 'commission_id', value: commissionId}]) as TeacherTupleFromBackend[]; 

  return parseTeacherTupleFromBackend(teachersList)
}

export default { fetchTeachersOfCommission };