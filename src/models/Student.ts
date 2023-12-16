export interface Student {
  id: number;
  padron: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
}

export interface StudentFromBackend {
  id: number;
  padron: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
}

export function parseStudentFromBackend(studentFromBackend: StudentFromBackend): Student {
  return {
    id: studentFromBackend.id,
    padron: studentFromBackend.padron,
    firstName: studentFromBackend.first_name,
    lastName: studentFromBackend.last_name,
    dni: studentFromBackend.dni,
    email: studentFromBackend.email,
  };
}