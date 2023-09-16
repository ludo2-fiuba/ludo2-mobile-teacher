import moment from 'moment';

export enum FinalStatus {
  Draft,
  Rejected,
  Future,
  SoonToStart,
  Open,
  Grading,
  Closed,
}

export default class Final {
  readonly id: integer;
  readonly subjectName: string;
  readonly date: Date;
  // DF: Draft
  // RJ: Reject
  // OP: Open
  // PA: Pending Act
  // AS: Act Sent
  readonly status: string;
  readonly qrId?: string;
  readonly act?: number;

  constructor(
    id: integer,
    subjectName: string,
    date: Date,
    status: string = 'DF',
    qrId: string = null,
    act: number = null,
  ) {
    this.id = id;
    this.subjectName = subjectName;
    this.date = date;
    this.status = status;
    this.qrId = qrId === undefined ? null : qrId;
    this.act = act === undefined ? null : act;
  }

  // Used for when the students can no longer submit an Exam.
  finalize() {
    this.status = 'PA';
  }

  // Used for closing the Final for good.
  close() {
    this.status = 'AS';
  }

  currentStatus(): FinalStatus {
    if (this.status == 'DF') {
      return FinalStatus.Draft;
    }
    if (this.status == 'RJ') {
      return FinalStatus.Rejected;
    }
    if (this.status == 'AS') {
      return FinalStatus.Closed;
    }
    if (this.status == 'PA') {
      return FinalStatus.Grading;
    }
    // Calculations give the previous day if necessary.
    var hoursBefore = new Date(this.date);
    hoursBefore.setHours(this.date.getHours() - 5);
    if (new Date() < hoursBefore) {
      return FinalStatus.Future;
    }
    if (new Date() >= this.date) {
      return FinalStatus.Open;
    }
    return FinalStatus.SoonToStart;
  }

  toObject() {
    return {
      id: this.id,
      subjectName: this.subjectName,
      date: moment(this.date).format('YYYY-MM-DD HH:mm'),
      status: this.status,
      qrId: this.qrId,
      act: this.act,
    };
  }

  static fromObject(object) {
    return new Final(
      object.id,
      object.subjectName,
      moment(object.date, 'YYYY-MM-DD HH:mm').toDate(),
      object.status,
      object.qrId,
      object.act,
    );
  }
}
