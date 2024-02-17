import { QRAttendance, QRAttendanceSnakeCase } from '../models/QRAttendance.ts';
import { convertSnakeToCamelCase } from '../utils/convertSnakeToCamelCase.ts';
import { post } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/semesters/attendance';

export async function generateAttendanceQR(semesterId: number): Promise<QRAttendance> {
  const qrAttendanceSnakeCase: QRAttendanceSnakeCase = await post(`${domainUrl}`, {'semester': semesterId}) as QRAttendanceSnakeCase; 
  return convertSnakeToCamelCase(qrAttendanceSnakeCase)
}

export default {generateAttendanceQR};