import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";
import { DniSchema } from "../../interfaces/dataSchemas.interfaces";
import { PatientInterface } from "../../interfaces/patient.interfaces";

export class ReadPatientByDniUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute({ dni }: PatientInterface): Promise<Patient | null> {
    const parsedDni = DniSchema.safeParse(dni);
    if (!parsedDni.success) {
      throw CustomError.badRequest(`Invalid DNI: ${parsedDni.error.message}`, {
        location: "ReadPatientByDniUseCase",
      });
    }

    return await this.repository.findByDni(dni);
  }
}
