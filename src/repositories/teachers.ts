import { Teacher, TeacherSnakeCase, TeacherTuple, TeacherTupleSnakeCase } from '../models/Teachers.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { get, post, put } from './authenticatedRepository.ts';

export async function fetchAllTeachers(): Promise<Teacher[]> {
  const teachersList: TeacherSnakeCase[] = await get(`api/teachers`) as TeacherSnakeCase[];
  return convertSnakeToCamelCase(teachersList)
}

export async function fetchTeachersOfCommission(commissionId: number): Promise<TeacherTuple[]> {
  const teachersList: TeacherTupleSnakeCase[] = await get(`api/commissions/teachers`, [{key: 'commission_id', value: commissionId}]) as TeacherTupleSnakeCase[]; 
  const parsedTeachersList: TeacherTuple[] = convertSnakeToCamelCase(teachersList)
  return parsedTeachersList
}

export async function modifyRoleOfTeacherInCommission(commissionId: number, teacherId: number, role: string) {
  const roleToBeCreatedInCommission = {
    commission: commissionId,
    teacher: teacherId,
    role: role
  }
  console.log("Updating role for teacher in commission");
  console.log(roleToBeCreatedInCommission);
  
  const result = await put(`api/commissions/teachers`, roleToBeCreatedInCommission)
  return result;
}

export async function createRoleForTeacherInCommission(commissionId: number, teacherId: number, role: string) {
  const roleToBeCreatedInCommission = {
    commission: commissionId,
    teacher: teacherId,
    role: role
  }
  console.log("Creating role for teacher in commission");
  console.log(roleToBeCreatedInCommission);
  
  const result = await post(`api/commissions/teachers`, roleToBeCreatedInCommission)
  return result;
}

export default { fetchTeachersOfCommission, fetchAllTeachers, modifyRoleOfTeacherInCommission };