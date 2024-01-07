export interface TeacherRole {
  id: number;
  shortVersion: string;
  longVersion: string;
}

const teacherRoles: TeacherRole[] = [
  {
    id: 1,
    shortVersion: 'T',
    longVersion: 'Titular'
  },
  {
    id: 2,
    shortVersion: 'A',
    longVersion: 'Ayudante'
  }
]

export default teacherRoles;