import { Commission, Subject } from '../models';
import { CommissionFromBackend, parseCommissionFromBackend } from '../models/Commission.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/commissions/my_commissions';
// {{baseUrl}}/api/teacher/commissions/my_commissions/

export async function fetchAll(): Promise<Commission[]> {
  const commissionsData: any = await get(`${domainUrl}`); 

  const parsedCommissions = commissionsData.map((commission: CommissionFromBackend) => {
    return parseCommissionFromBackend(commission);
  })

  return parsedCommissions;
}

export default {fetchAll};
