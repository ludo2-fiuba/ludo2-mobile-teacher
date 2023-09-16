export default class Student {
  readonly studentId: string; // Padrón
  readonly firstName: string;
  readonly lastName: string;
  readonly dni: string;
  readonly email: string;

  constructor(
    studentId: string,
    firstName: string,
    lastName: string,
    dni: string,
    email: string,
  ) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.email = email;
  }
}
