export interface Subject {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  correlatives: any[];
}

export interface SubjectCamelCase {
  id: number;
  code: string;
  name: string;
  department_id: number;
  correlatives: any[];
}