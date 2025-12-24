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

    // Merge new data with existing data (for partial updates)
    const mergedData: PatientInterface = {
      dni: data.dni ?? existingPatient.dni,
      firstName: data.firstName ?? existingPatient.firstName,
      lastName: data.lastName ?? existingPatient.lastName,
      birthDate: data.birthDate ?? existingPatient.birthDate,
      email: data.email ?? existingPatient.email,
      sex: data.sex ?? existingPatient.sex,
    };

    const updatedPatient = await this.repository.update(
      id,
      mergedData
    );

    return updatedPatient;
  }
}
