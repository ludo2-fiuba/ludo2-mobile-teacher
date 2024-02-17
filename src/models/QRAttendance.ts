import { ChiefTeacher } from "./ChiefTeacher";
import { Semester } from "./Semester";

export interface QRAttendance {
  semester:      Semester;
  ownerTeacher: ChiefTeacher;
  createdAt:    Date;
  qrid:          string;
}

export interface QRAttendanceSnakeCase {
  semester:      Semester;
  owner_teacher: ChiefTeacher;
  created_at:    Date;
  qrid:          string;
}



