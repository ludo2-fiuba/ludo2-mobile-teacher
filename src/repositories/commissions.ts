import { Commission, Subject } from '../models';
import { CommissionFromBackend } from '../models/Commission.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/commissions';

export function parseComissionFromBackend(commission: CommissionFromBackend): Commission {
  return {
    id: commission.id,
    subjectSiuId: commission.subject_siu_id,
    subjectName: commission.subject_name,
    chiefTeacher: {
      firstName: commission.chief_teacher.first_name,
      lastName: commission.chief_teacher.last_name,
      dni: commission.chief_teacher.dni,
      email: commission.chief_teacher.email,
      legajo: commission.chief_teacher.legajo,
    },
  } ;
}

export async function fetchAll(): Promise<Commission[]> {
  const comissionsData: any = await get(`${domainUrl}`); 

  const parsedCommissions = comissionsData.map((commission: CommissionFromBackend) => {
    return parseComissionFromBackend(commission);
  })

  return parsedCommissions;
}

export default {fetchAll};
