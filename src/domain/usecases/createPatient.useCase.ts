import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { CreatePatientDTO } from "../dtos/createPatient.dto";
import { Patient } from "../entities/patient";
import { CustomError } from "../errors/customErrors";
import { PatientRepository } from "../repositories/patientRepository";
import { ReadPatientByDniUseCase } from "./readPatientByDni.useCase";

export class CreatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(request: any): Promise<Patient | null> {
    // Validate the patient object
    const [error, patientDTO] = CreatePatientDTO.create(request.body);
    if (error) {
      console.error("=>UseCase: Error creating patient DTO:", error);
      throw CustomError.badRequest(error);
    }

    console.log("=>UseCase: Creating patient with DTO:", patientDTO);

    if (!patientDTO!.dni) {
      console.error("=>UseCase: DNI is required!!!");
      throw CustomError.badRequest("DNI is required!!!");
    }
    if (!patientDTO!.firstName) {
      console.error("=>UseCase: First name is required!!!");
      throw CustomError.badRequest("First name is required!!!");
    }
    if (!patientDTO!.lastName) {
      console.error("=>UseCase: Last name is required!!!");
      throw CustomError.badRequest("Last name is required!!!");
    }
    if (!patientDTO!.birthDate) {
      console.error("=>UseCase: Date of birth is required!!!");
      throw CustomError.badRequest("Date of birth is required!!!");
    }
    if (!patientDTO!.sex) {
      console.error("=>UseCase: Sex is required!!!");
      throw CustomError.badRequest("Sex is required!!!");
    }

    // Check if the patient already exists
    const readPatientByDniUseCase = new ReadPatientByDniUseCase(
      this.repository
    );
    const exists = await readPatientByDniUseCase.execute(request);
    if (exists) {
      console.error(
        `=>UseCase: Patient with DNI ${patientDTO!.dni} already exists`
      );
      throw CustomError.conflict(`Patient with DNI ${patientDTO!.dni} already exists`);
    }
    // Create a new patient entity
    const patient = new Patient(
      patientDTO!.dni,
      patientDTO!.firstName,
      patientDTO!.lastName,
      patientDTO!.birthDate,
      patientDTO!.email ?? "",
      patientDTO!.sex
    );
    try {
      await this.repository.save(patient);
      console.log("=>UseCase: Patient created successfullyyyyyyy");
      return patient;
    } catch (error) {
      console.error("=>UseCase: Error saving patient:", error);
      throw new Error(`Error saving patient: ${error}`);
    }
    console.log("=>UseCase: THIS SHOULD NOT BE REACHED");
  }
}
