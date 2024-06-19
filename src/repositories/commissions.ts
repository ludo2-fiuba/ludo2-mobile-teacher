import { Commission } from '../models';
import { CommissionSnakeCase } from '../models/Commission.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, put } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/commissions';

export async function fetchAll(): Promise<Commission[]> {
  const commissionsData: CommissionSnakeCase = await get(`${domainUrl}/my_commissions`) as CommissionSnakeCase

  const parsedCommissions: Commission[] = convertSnakeToCamelCase(commissionsData) as Commission[];

  return parsedCommissions;
}

export async function modifyChiefTeacherWeight(commissionId: number, graderWeight: number) {
  const body = {
    id: commissionId,
    chief_teacher_grader_weight: graderWeight,
  }
  const result = await put(`${domainUrl}/chief_teacher_grader_weight`, body) as CommissionSnakeCase
  return convertSnakeToCamelCase(result) as Commission;
}

export default { fetchAll, modifyChiefTeacherWeight };
