import { Commission, Subject } from '../models';
import { CommissionFromBackend, parseComissionFromBackend } from '../models/Commission.ts';
import { Semester, SemesterFromBackend, parseSemesterFromBackend } from '../models/Semester.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/semesters/commission_present_semester';

export async function fetchPresentSemesterFromComissionId(commissionId: number): Promise<Semester> {
  const presentSemester: SemesterFromBackend = await get(`${domainUrl}`, [{key: 'commission_id', value: commissionId}]) as SemesterFromBackend; 

  return parseSemesterFromBackend(presentSemester)
}

export default {fetchPresentSemesterFromComissionId};
