import { SemesterStats } from '../models';
import { get } from './authenticatedRepository';

const domainUrl = 'api/statistics';

export async function fetchSemesterStats(semesterId: number): Promise<SemesterStats> {
  // return await get(`${domainUrl}/teacher`, [{ key: 'semester_id', value: semesterId }]) as SemesterStats;
  return {
    "semester_average": [
      {
        "date": "2023-11-20T22:00:00Z",
        "average": 7
      },
      {
        "date": "2023-11-20T22:00:00Z",
        "average": 7
      },
      {
        "date": "2023-11-20T22:00:00Z",
        "average": 7
      },
      {
        "date": "2023-11-20T22:00:00Z",
        "average": 7
      },
      {
        "date": "2023-11-20T22:00:00Z",
        "average": 7
      },
    ],
    "cummulative_dessertions": [
      {
        "date": "2023-11-01T22:00:00Z",
        "cumulative_students_deserted": 2
      },
      {
        "date": "2024-06-02T22:00:00Z",
        "cumulative_students_deserted": 4
      }
    ],
    "attendance_rate": 0.75
  }
}

export default { fetchSemesterStats };
