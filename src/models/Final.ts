import moment from 'moment';

export enum FinalStatus {
  Draft = 'DF',
  Rejected = 'RJ',
  Future = 'FT',
  SoonToStart = 'SS',
  Open = 'OP',
  Grading = 'PA',
  Closed = 'AS',
}

export default class Final {
  readonly id: number;
  readonly subjectName: string;
  readonly date: Date;
  status: FinalStatus;
  readonly qrId?: string | null;
  readonly act?: number | null;

  constructor(
    id: number,
    subjectName: string,
    date: Date,
    status: FinalStatus = FinalStatus.Draft,
    qrId: string | null = null,
    act: number | null = null,
  ) {
    this.id = id;
    this.subjectName = subjectName;
    this.date = date;
    this.status = status;
    this.qrId = qrId;
    this.act = act;
  }

  finalize(): void {
    this.status = FinalStatus.Grading;
  }

  close(): void {
    this.status = FinalStatus.Closed;
  }

  currentStatus(): FinalStatus {
    switch (this.status) {
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
      // TODO: Remove up to here
      default:
        const hoursBefore = new Date(this.date);
        hoursBefore.setHours(this.date.getHours() - 5);
        if (new Date().getTime() < hoursBefore.getTime()) {
          return FinalStatus.Future;
        }
        if (new Date().getTime() >= this.date.getTime()) {
          return FinalStatus.Open;
        }
        return FinalStatus.SoonToStart;
    }
  }

  toObject(): {
    id: number;
    subjectName: string;
    date: string;
    status: FinalStatus;
    qrId?: string | null;
    act?: number | null;
  } {
    return {
      id: this.id,
      subjectName: this.subjectName,
      date: moment(this.date).format('YYYY-MM-DD HH:mm'),
      status: this.status,
      qrId: this.qrId,
      act: this.act,
    };
  }

  static fromObject(object: {
    id: number;
    subjectName: string;
    date: string;
    status: FinalStatus;
    qrId?: string;
    act?: number;
  }): Final {
    return new Final(
      object.id,
      object.subjectName,
      moment(object.date, 'YYYY-MM-DD HH:mm').toDate(),
      object.status,
      object.qrId ?? null,
      object.act ?? null,
    );
  }
}
