import { Semester } from "./Semester";
import { Teacher } from "./Teacher";

export interface QRAttendance {
  semester:       Semester;
  ownerTeacher:   Teacher;
  createdAt:      Date;
  expiresAt:      Date;
  qrid:           string;
}

export interface QRAttendanceSnakeCase {
  semester:       Semester;
  owner_teacher:  Teacher;
  created_at:     Date;
  expires_at:     Date;
  qrid:           string;
}



