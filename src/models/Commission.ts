import { Teacher, TeacherSnakeCase } from "./Teacher";

export interface Commission {
  id: number;
  subjectSiuId: number;
  subjectName:   string;
  chiefTeacher:  Teacher;
  chiefTeacherGraderWeight: number;
}
export interface CommissionSnakeCase {
  id: number;
  subject_siu_id: number;
  subject_name:   string;
  chief_teacher:  TeacherSnakeCase;
  chief_teacher_grader_weight: number;
}