export default class Subject {
  readonly id: integer;
  readonly code: string;
  readonly name: string;

  constructor(id: integer, code: string, name: string) {
    this.id = id;
    this.code = code;
    this.name = name;
  }

  toObject() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
    };
  }

  static fromObject(object) {
    return new Subject(object.id, object.code, object.name);
  }
}
