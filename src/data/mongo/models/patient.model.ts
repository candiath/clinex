import mongoose from "mongoose";

/**
 * export class Patient {
  constructor(
    public id: string,
    public dni: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date,
    public email: string,
    public sex: 'male' | 'female' | 'other',
  ) {
    this.id = id;
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.sex = sex;
  }
}
 */
const patientSchema = new mongoose.Schema ({
  id: {
    type: String,
    required: false,
    unique: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: false
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
});

export const PatientModel = mongoose.model( 'Patient', patientSchema );