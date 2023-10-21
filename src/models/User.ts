export default class User {
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly teacherId?: string;

  constructor(
    dni: string,
    firstName: string,
    lastName: string,
    email: string,
    teacherId?: string = null,
  ) {
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.teacherId = teacherId === undefined ? null : teacherId;
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isTeacher(): boolean {
    return this.teacherId !== null;
  }
}
