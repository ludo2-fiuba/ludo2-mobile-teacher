import { TeacherTuple } from '../models/TeacherTuple';

export function computeWeightsToPercentages(staffTeachers: TeacherTuple[]): string[] {
  if (!staffTeachers) {
    return [];
  }

  const chiefTeacherWeight = staffTeachers[0].commission.chiefTeacherGraderWeight;
  const totalWeight = staffTeachers.reduce((sum, teacher) => sum + teacher.graderWeight, 0) + chiefTeacherWeight;

  return staffTeachers.map(teacher => {
    const percentage = (teacher.graderWeight / totalWeight) * 100;
    return percentage.toFixed(2);
  });
}
