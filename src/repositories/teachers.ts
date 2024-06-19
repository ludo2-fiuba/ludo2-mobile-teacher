import { TeacherTuple, TeacherTupleSnakeCase } from '../models/TeacherTuple.ts';
import { TeacherSnakeCase, Teacher } from '../models/Teacher.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post, put } from './authenticatedRepository.ts';

export async function fetchAllTeachers(): Promise<Teacher[]> {
  const teachersList: TeacherSnakeCase[] = await get('api/teachers') as TeacherSnakeCase[];
  return convertSnakeToCamelCase(teachersList)
}

export async function fetchTeachersOfCommission(commissionId: number): Promise<TeacherTuple[]> {
  const teachersList: TeacherTupleSnakeCase[] = await get('api/commissions/teachers', [{key: 'commission_id', value: commissionId}]) as TeacherTupleSnakeCase[]; 
  const parsedTeachersList: TeacherTuple[] = convertSnakeToCamelCase(teachersList)
  return convertSnakeToCamelCase(parsedTeachersList)
}

export async function modifyRoleOfTeacherInCommission(commissionId: number, teacherId: number, role: string, graderWeight: number) {
  const roleToBeCreatedInCommission = {
    commission: commissionId,
    teacher: teacherId,
    role: role,
    grader_weight: graderWeight,
  }
  const result = await put('api/commissions/teachers', roleToBeCreatedInCommission)
  return convertSnakeToCamelCase(result);
}

export async function createRoleForTeacherInCommission(commissionId: number, teacherId: number, role: string) {
  const roleToBeCreatedInCommission = {
    commission: commissionId,
    teacher: teacherId,
    role: role,
    grader_weight: 1.0,
  }

  console.log('roleToBeCreatedInCommission')
  console.log(roleToBeCreatedInCommission)
  
  const result = await post('api/commissions/teachers', roleToBeCreatedInCommission)
  console.log('result', result);
  
  return convertSnakeToCamelCase(result);
}

export default { fetchTeachersOfCommission, fetchAllTeachers, modifyRoleOfTeacherInCommission, createRoleForTeacherInCommission };