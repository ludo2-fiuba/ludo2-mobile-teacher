import { CommissionStats } from '../models';
import { get } from './authenticatedRepository';

const domainUrl = 'api/statistics';

export async function fetchCommissionStats(): Promise<CommissionStats> {
  return await get(`${domainUrl}/commission`) as CommissionStats;
}

export default { fetchCommissionStats };
