import { ChiefTeacher, ChiefTeacherSnakeCase } from "./ChiefTeacher";

export interface Commission {
  id: number;
  subjectSiuId: number;
  subjectName:   string;
  chiefTeacher:  ChiefTeacher;
}
export interface CommissionSnakeCase {
  id: number;
  subject_siu_id: number;
  subject_name:   string;
  chief_teacher:  ChiefTeacherSnakeCase;
}