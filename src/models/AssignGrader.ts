import { Evaluation } from "./Evaluation";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

export interface AssignGrader {
    evaluation: Evaluation;
    student:    Student;
    grade:      null;
    grader:     Teacher;
    createdAt: Date;
    updatedAt: Date;
}

export interface AssignGraderCamelCase {
    evaluation: Evaluation;
    student:    Student;
    grade:      null;
    grader:     Teacher;
    created_at: Date;
    updated_at: Date;
}