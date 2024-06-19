import { TeacherTuple } from '../models/TeacherTuple';

export function mapWeightToPercentage(teacherDNI: string, staffTeachers: TeacherTuple[]): string {
  const selectedTeacher = staffTeachers.find((teacherRole) => teacherRole.teacher.dni === teacherDNI);
  if (!staffTeachers || !selectedTeacher) {
    return '';
  }

  const totalWeight = getTotalWeight(staffTeachers);
  const percentage = (selectedTeacher.graderWeight / totalWeight) * 100;
  return percentage.toFixed(2);
}

export function mapPercentageToWeight(teacherDNI: string, percentage: number, staffTeachers: TeacherTuple[]): number {
  if (!staffTeachers) {
    return NaN;
  }

  const staffTeachersWithoutCurrent = staffTeachers.filter((teacherRole) => teacherRole.teacher.dni !== teacherDNI)
  const totalWeightWithoutCurrent = getTotalWeight(staffTeachersWithoutCurrent);
  return percentage * totalWeightWithoutCurrent / (1 - percentage);
};

function getTotalWeight(staffTeachers: TeacherTuple[]): number {
  const chiefTeacherWeight = staffTeachers[0].commission.chiefTeacherGraderWeight;
  return staffTeachers.reduce((sum, teacher) => sum + teacher.graderWeight, 0) + chiefTeacherWeight;
}
