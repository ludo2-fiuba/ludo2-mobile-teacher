import { Student } from '../models';
import { StudentSnakeCase } from '../models/Student.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get } from './authenticatedRepository.ts';

const domainUrl = 'api/students';

export async function getStudentByPadron(padron: string): Promise<Student> {
  const student: StudentSnakeCase = await get(`${domainUrl}`, [{key: 'padron', value: padron}]) as StudentSnakeCase; 
  return convertSnakeToCamelCase(student)
}

export default {getStudentByPadron};
