import { SemesterStats } from '../models';
import { get } from './authenticatedRepository';

const domainUrl = 'api/statistics';

export async function fetchSemesterStats(semesterId: number): Promise<SemesterStats> {
  return await get(`${domainUrl}/teacher`, [{ key: 'semester_id', value: semesterId }]) as SemesterStats;
}

export default { fetchSemesterStats };
