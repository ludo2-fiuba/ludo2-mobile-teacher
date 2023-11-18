export interface ChiefTeacher {
  firstName: string;
  lastName:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}


export interface ChiefTeacherFromBackend {
  first_name: string;
  last_name:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

export function parseChiefTeacherFromBackend(teacher: ChiefTeacherFromBackend): ChiefTeacher {
  return {
    firstName: teacher.first_name,
    lastName:  teacher.last_name,
    dni:        teacher.dni,
    email:      teacher.email,
    legajo:     teacher.legajo,
  };
}