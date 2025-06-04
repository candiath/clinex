import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";


export class ReadPatientByIdUseCase {
  constructor( private readonly repository: PatientRepoImplementation ) {}

  public async execute ( id: string ): Promise<Patient | null> {
    return await this.repository.findById( id );
  }
}