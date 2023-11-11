import { Commission, Subject } from '../models';
import { CommissionFromBackend } from '../models/Commission.ts';
import { Semester, SemesterFromBackend } from '../models/Semester.ts';
import { get } from './authenticatedRepository.ts';
import { parseComissionFromBackend } from './commissions.ts';

const domainUrl = 'api/semesters/commission_present_semester';

export async function fetchPresentSemesterFromComissionId(commissionId: number): Promise<Semester> {
  console.log("fetchPresentSemesterFromComissionId");
  console.log(commissionId);
  
  const presentSemester: SemesterFromBackend = await get(`${domainUrl}`, [{key: 'commission_id', value: commissionId}]) as SemesterFromBackend; 

  const semester: Semester = {
    startDate: new Date(presentSemester.start_date),
    yearMoment: presentSemester.year_moment,
    comission: parseComissionFromBackend(presentSemester.commission),
  }

  return semester;
}

export default {fetchPresentSemesterFromComissionId};
