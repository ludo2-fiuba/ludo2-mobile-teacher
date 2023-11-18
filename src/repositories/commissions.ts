import { Commission, Subject } from '../models';
import { CommissionFromBackend, parseComissionFromBackend } from '../models/Commission.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/commissions';

export async function fetchAll(): Promise<Commission[]> {
  const comissionsData: any = await get(`${domainUrl}`); 

  const parsedCommissions = comissionsData.map((commission: CommissionFromBackend) => {
    return parseComissionFromBackend(commission);
  })

  return parsedCommissions;
}

export default {fetchAll};
