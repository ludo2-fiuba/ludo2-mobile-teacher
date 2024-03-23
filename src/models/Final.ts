import { FinalStatus } from './FinalStatus';
import { Subject } from './Subject';
import { FinalExam, FinalExamCamelCase } from './FinalExam';

export interface Final {
  id:          number;
  subject:     Subject;
  date:        string;
  qrid:        string;
  status:      string;
  siuId:      number;
  act:         null;
  finalExams: FinalExam[];
}

export interface FinalCamelCase {
  id:          number;
  subject:     Subject;
  date:        string;
  qrid:        string;
  status:      string;
  siu_id:      number;
  act:         null;
  final_exams?: FinalExamCamelCase[];
}

export function calculateFinalCurrentStatus(final: Final): FinalStatus {
  switch (final.status) {
    case FinalStatus.Draft:
      return FinalStatus.Draft;
    case FinalStatus.Rejected:
      return FinalStatus.Rejected;
    case FinalStatus.Closed:
      return FinalStatus.Closed;
    case FinalStatus.Grading:
      return FinalStatus.Grading;
    // TODO: Remove this case
    case FinalStatus.Open:
      return FinalStatus.Open;
    case FinalStatus.Future:
      return FinalStatus.Future
    // TODO: Remove up to here
    default:
      const finalAsDate = new Date(final.date);
      finalAsDate.setHours(finalAsDate.getHours() - 5);

      if (new Date().getTime() < finalAsDate.getTime()) {
        return FinalStatus.Future;
      }
      if (new Date().getTime() >= finalAsDate.getTime()) {
        return FinalStatus.Open;
      }
      return FinalStatus.SoonToStart;
  }
}