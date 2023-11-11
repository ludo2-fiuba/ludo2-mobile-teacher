// isOpen(): boolean {
//   // TODO: Check real state with properties or have it come from backend
//   return this.term.getFullYear() == new Date().getFullYear();
// }
export interface Commission {
  id: number;
  subjectSiuId: number;
  subjectName:   string;
  chiefTeacher:  ChiefTeacher;
}

export interface ChiefTeacher {
  firstName: string;
  lastName:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}

export interface CommissionFromBackend {
  id: number;
  subject_siu_id: number;
  subject_name:   string;
  chief_teacher:  ChiefTeacherFromBackend;
}

export interface ChiefTeacherFromBackend {
  first_name: string;
  last_name:  string;
  dni:        string;
  email:      string;
  legajo:     string;
}


