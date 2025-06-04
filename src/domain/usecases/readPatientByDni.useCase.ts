import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";


export class ReadPatientByDniUseCase {
  constructor( private readonly repository: PatientRepoImplementation ){}

  public async execute( dni: string ): Promise<Patient | null> {
    return await this.repository.findByDni( dni );
  }
}