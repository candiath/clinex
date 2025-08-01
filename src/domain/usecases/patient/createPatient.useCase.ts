import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CreatePatientDTO } from "../../dtos/createPatient.dto";
import { Patient } from "../../entities/patient";
import { CustomError } from "../../errors/customError";
import { PatientInterface } from "../../interfaces/patient.interface";
// import { PatientRepository } from "../repositories/patientRepository";
// import { ReadPatientByDniUseCase } from "./readPatientByDni.useCase";

export class CreatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute( data: PatientInterface ): Promise<Patient | null> {
    // Validate the patient object
    const [error, patientDTO] = CreatePatientDTO.create( data );
    if (error) {
      console.error("=>UseCase: Error creating patient DTO:", error);
      throw CustomError.badRequest(error);
    }

    // console.log("=>UseCase: Creating patient with DTO:", patientDTO);

    if (!patientDTO!.dni) {
      throw CustomError.badRequest("DNI is required!!!");
    }
    if (!patientDTO!.firstName) {
      throw CustomError.badRequest("First name is required!!!");
    }
    if (!patientDTO!.lastName) {
      throw CustomError.badRequest("Last name is required!!!");
    }
    if (!patientDTO!.birthDate) {
      throw CustomError.badRequest("Date of birth is required!!!");
    }
    if (!patientDTO!.sex) {
      throw CustomError.badRequest("Sex is required!!!");
    }

    // No se consulta previamente si existe el paciente, se maneja el error de clave duplicada
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
    } catch (error: any) {
      // Manejo de error de clave duplicada (DNI único)
      if (error.code === 11000 && error.keyPattern && error.keyPattern.dni) {
        console.error(`=>UseCase: Patient with DNI ${patientDTO!.dni} already exists`);
        throw CustomError.conflict(`Patient with DNI ${patientDTO!.dni} already exists`);
      }
      console.log(`========> Error: \n ${error}`);
      console.log();
      console.log();
      console.log();
      console.error("=>UseCase: Error saving patient:", error);
      throw new Error(`Error saving patient: ${error}`);  
    }
  }
}
