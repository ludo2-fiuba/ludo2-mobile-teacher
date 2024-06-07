export interface SemesterStats {
    semester_average: SemesterAverage[];
    cummulative_dessertions: CummulativeDessertion[];
    attendance_rate: number;
}

export interface CummulativeDessertion {
    date: string;
    cumulative_students_deserted: number;
}

interface SemesterAverage {
    date: string;
    average: number;
}
