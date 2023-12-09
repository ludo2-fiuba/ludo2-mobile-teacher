import { Commission, CommissionFromBackend, parseCommissionFromBackend } from "./Commission";

export interface TeacherTuple {
  commission: Commission;
  teacher:    Teacher;
  role:       string;
}

export interface TeacherTupleFromBackend {
  commission: CommissionFromBackend;
  teacher:    TeacherFromBackend;
  role:       string;
}

export interface Teacher {
  firstName: string;
  lastName:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

export interface TeacherFromBackend {
  first_name: string;
  last_name:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

export function parseTeacherTupleFromBackend(teachersList: TeacherTupleFromBackend[]): TeacherTuple[] {
  const teacherTuples: TeacherTuple[] = [];

  for (const teacherList of teachersList) {
    const parsedTeacherTuple: TeacherTuple = {
      commission: parseCommissionFromBackend(teacherList.commission),
      teacher:    parseTeacherFromBackend(teacherList.teacher),
      role:       teacherList.role,
    }
    teacherTuples.push(parsedTeacherTuple);
  }
  
  return teacherTuples
}

export function parseTeacherFromBackend(teacher: TeacherFromBackend): Teacher {
  return {
    firstName: teacher.first_name,
    lastName:  teacher.last_name,
    dni:        teacher.dni,
    email:      teacher.email,
    legajo:     teacher.legajo,
  }
}
