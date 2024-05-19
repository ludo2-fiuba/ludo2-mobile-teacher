export interface Teacher {
  id:         number;
  firstName:  string;
  lastName:   string;
  dni:        string;
  email:      string;
  legajo?:    string;
  padron?:    string
}

export interface TeacherSnakeCase {
  id:         number;
  first_name: string;
  last_name:  string;
  dni:        string;
  email:      string;
  legajo?:    string;
  padron?:    string;
}