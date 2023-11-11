import { CommissionFromBackend, Commission } from "./Commission";

export interface Semester {
  yearMoment: string
  startDate: Date;
  comission: Commission
}

export interface SemesterFromBackend {
  year_moment: string;
  start_date:  Date;
  commission:  CommissionFromBackend;
}
