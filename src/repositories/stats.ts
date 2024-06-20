import { SemesterStats } from '../models';
import { get } from './authenticatedRepository';

const domainUrl = 'api/statistics';

export async function fetchSemesterStats(semesterId: number): Promise<SemesterStats> {
  const data = await get(`${domainUrl}/teacher`, [{ key: 'semester_id', value: semesterId }]) as SemesterStats;
  console.log(`StatsRepository: ${JSON.stringify(data)}`)
  return data;
  // return {
  //   "semester_average": [
  //     {
  //       "date": "2023-02-20T22:00:00Z",
  //       "average": 6.2
  //     },
  //     {
  //       "date": "2023-03-20T22:00:00Z",
  //       "average": 5.2
  //     },
  //     {
  //       "date": "2023-04-20T22:00:00Z",
  //       "average": 5.7
  //     },
  //     {
  //       "date": "2023-05-20T22:00:00Z",
  //       "average": 6.1
  //     },
  //     {
  //       "date": "2024-06-01T22:00:00Z",
  //       "average": 6.4
  //     },
  //   ],
  //   "cummulative_dessertions": [
  //     {
  //       "date": "2024-03-01T22:00:00Z",
  //       "cumulative_students_deserted": 2
  //     },
  //     {
  //       "date": "2024-06-02T22:00:00Z",
  //       "cumulative_students_deserted": 4
  //     }
  //   ],
  //   "attendance_rate": 0.75
  // }
}

export default { fetchSemesterStats };
