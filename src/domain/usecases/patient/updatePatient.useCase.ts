import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";
import { PatientInterface } from "../../interfaces/patient.interfaces";
import { EntityID } from "../../valueObjects/entityID";

export class UpdatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: EntityID, data: PatientInterface): Promise<Patient> {
    const existingPatient = await this.repository.findById(id);
    if (!existingPatient)
      throw CustomError.notFound("Patient not found", {
        location: "UpdatePatientUseCase",
      });

    const updatedPatient = await this.repository.update(
      existingPatient.id!,
      data
    );

    return updatedPatient;
  }
}
