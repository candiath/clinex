import { Patient } from "../entities/patient";
import { PatientRepository } from "../repositories/patientRepository";


export class CreatePatientUseCase {
  constructor( private readonly repository: PatientRepository ){}

  public async execute( patient: Patient ): Promise< void > {
    return await this.repository.save( patient );
  }
}