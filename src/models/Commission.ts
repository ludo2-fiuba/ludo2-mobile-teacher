import { ChiefTeacher, ChiefTeacherFromBackend, parseChiefTeacherFromBackend } from "./ChiefTeacher";

export interface Commission {
  id: number;
  subjectSiuId: number;
  subjectName:   string;
  chiefTeacher:  ChiefTeacher;
}
export interface CommissionFromBackend {
  id: number;
  subject_siu_id: number;
  subject_name:   string;
  chief_teacher:  ChiefTeacherFromBackend;
}

export function parseComissionFromBackend(commission: CommissionFromBackend): Commission {
  return {
    id: commission.id,
    subjectSiuId: commission.subject_siu_id,
    subjectName: commission.subject_name,
    chiefTeacher: parseChiefTeacherFromBackend(commission.chief_teacher),
  };
}