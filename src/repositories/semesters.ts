import { Evaluation } from '../models/Evaluation.ts';
import { Semester, SemesterSnakeCase } from '../models/Semester.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/semesters/commission_present_semester';

export async function fetchPresentSemesterFromCommissionId(commissionId: number): Promise<Semester> {
  const presentSemester: SemesterSnakeCase = await get(`${domainUrl}`, [{key: 'commission_id', value: commissionId}]) as SemesterSnakeCase; 
  return convertSnakeToCamelCase(presentSemester)
}

export default {fetchPresentSemesterFromCommissionId};
