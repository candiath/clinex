import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";

export class ReadAllPatientsUseCase {
  constructor(readonly repository: PatientRepoImplementation) {}

  public async execute(data: any = null) {
    const query = await this.repository.list();

    return query;
  }
}