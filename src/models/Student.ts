export interface Student {
  id: number;
  padron: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  legajo?: string;
}

export interface StudentSnakeCase {
  id: number;
  padron: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  legajo?: string
}