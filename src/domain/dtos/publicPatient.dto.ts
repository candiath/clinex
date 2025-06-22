
export class PublicPatientDTO {
  private constructor(
    public id: string,
    public dni: string,
    public name: string,
    public surname: string,
    public birthDate: Date,
    public sex: string,
    public email?: string,
  ) {}

  static fromPatient(patient: any): PublicPatientDTO {
    return new PublicPatientDTO(
      patient._id,
      patient.dni,
      patient.firstName,
      patient.lastName,
      patient.birthDate,
      patient.sex,
      patient.email,
    );
  }
  // TODO: 
  static fromObject(obj: any): PublicPatientDTO {
    return new PublicPatientDTO(
      obj._id,
      obj.dni,
      obj.firstName,
      obj.lastName,
      obj.birthDate,
      obj.sex,
      obj.email,
    );
  }
}