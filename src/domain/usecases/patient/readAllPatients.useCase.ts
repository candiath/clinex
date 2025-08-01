import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient";


export class ReadAllPatientsUseCase {
  constructor( private readonly repository: PatientRepoImplementation){}

  public async execute(): Promise< Patient[] | null > {
    return await this.repository.list();
  }
}