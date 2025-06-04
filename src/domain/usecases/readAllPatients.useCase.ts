import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";


export class ReadAllPatientsUseCase {
  constructor( private readonly repository: PatientRepoImplementation){}

  public async execute(): Promise< Patient[] | null > {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // console.log('Executing ReadPatientUseCase...');
    return await this.repository.list();
  }
}