import { Commission, Subject } from '../models';
import { CommissionFromBackend } from '../models/Commission.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/commissions/my_commissions';
// {{baseUrl}}/api/teacher/commissions/my_commissions/

export async function fetchAll(): Promise<Commission[]> {
  const commissionsData: any = await get(`${domainUrl}`); 

  const parsedCommissions: Commission[] = commissionsData.map((commission: CommissionFromBackend) => {
    return convertSnakeToCamelCase(commission);
  })

  return parsedCommissions;
}

export default {fetchAll};
