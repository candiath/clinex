export class Patient {
  constructor(
    public dni: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date,
    public email: string,
    public sex: 'male' | 'female' | 'other',
    public id?: string,
  ) {
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.sex = sex;
    this.id = id;
  }
}