import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientDTO } from "../../dtos/patient/patient.dto";
import { CustomError } from "../../errors/customError";


export class UpdatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute( id: number , data: PatientDTO): Promise<boolean> {

    const existingPatient = await this.repository.findById(id);
    if (!existingPatient) throw CustomError.notFound();

    // TODO: issue #29

    // Update the patient with the new data
    const updatedPatient = await this.repository.update(existingPatient.id!, data);

    return updatedPatient;
  }
}
