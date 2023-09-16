import Subject from './Subject.ts';

export default class Commission {
  readonly id: integer;
  readonly name: string;
  readonly subject: Subject;
  readonly term: Date;

  constructor(id: integer, name: string, subject: Subject, term: Date) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.term = term;
  }

  isOpen(): boolean {
    // TODO: Check real state with properties or have it come from backend
    return this.term.getFullYear() == new Date().getFullYear();
  }
}
