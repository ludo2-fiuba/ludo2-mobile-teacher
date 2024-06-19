import { TeacherTuple } from '../models/TeacherTuple';

export function mapWeightToPercentage(teacherWeight: number, staffTeachers: TeacherTuple[]): string {
  if (!staffTeachers) {
    return '';
  }

  const totalWeight = getTotalWeight(staffTeachers);
  const percentage = (teacherWeight / totalWeight) * 100;
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

export function mapChiefPercentageToWeight(percentage: number, staffTeachers: TeacherTuple[]): number {
  if (!staffTeachers) {
    return NaN;
  }

  const totalWeightWithoutChief = getTotalWeight(staffTeachers, false);
  return percentage * totalWeightWithoutChief / (1 - percentage);
};

function getTotalWeight(staffTeachers: TeacherTuple[], includeChiefTeacher: boolean = true): number {
  const staffTeachersTotalWeight = staffTeachers.reduce((sum, teacher) => sum + teacher.graderWeight, 0);

  if (!includeChiefTeacher) {
    return staffTeachersTotalWeight
  }

  const chiefTeacherWeight = staffTeachers[0].commission.chiefTeacherGraderWeight;
  return staffTeachersTotalWeight + chiefTeacherWeight;
}
