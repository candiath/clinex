import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";


export class UpdatePatientUseCase {
  constructor( private readonly repository: PatientRepoImplementation ) {}

  public async execute( patient: Patient ) {
    this.repository.update( patient );
  }
}