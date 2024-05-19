import { Commission, CommissionSnakeCase } from "./Commission";
import { Teacher, TeacherSnakeCase } from "./Teacher";

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



