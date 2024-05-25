import { Student } from "./Student";

export interface StudentAttendance {
    student: Student,
    submittedAt: Date
}

export interface StudentAttendanceSnakeCase {
    student:      Student;
    submitted_at: Date;
}