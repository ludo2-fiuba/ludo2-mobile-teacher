import { Commission, CommissionSnakeCase } from "./Commission";

export interface TeacherTuple {
  commission: Commission;
  teacher:    Teacher;
  role:       string;
}

export interface TeacherTupleSnakeCase {
  commission: CommissionSnakeCase;
  teacher:    TeacherSnakeCase;
  role:       string;
}

export interface Teacher {
  firstName: string;
  lastName:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

export interface TeacherSnakeCase {
  first_name: string;
  last_name:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

