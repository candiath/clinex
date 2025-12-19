import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";

export class ReadAllPatientsUseCase {
  constructor(readonly repository: PatientRepoImplementation) {}

  public async execute(): Promise<Patient[]> {
    return await this.repository.list();
  }
}
