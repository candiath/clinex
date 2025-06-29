import { Request } from "express";
import { PatientDatasource } from "../datasources/patientDatasource";
import { DeletePatientDTO } from "../dtos/deletePatient.dto";
import { CustomError } from "../errors/customErrors";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientInterface } from "../interfaces/patient.interface";

export class DeletePatientUseCase {
  constructor( private readonly repository: PatientRepoImplementation ){}

  public async execute( data: PatientInterface ): Promise< boolean > {
    // TODO: if ( !acknowledged ) throw error;
    const [ error, dto ] = DeletePatientDTO.create( data );
    if ( error ) {
      console.error("=>UseCase: Error creating delete patient DTO:", error);
      throw CustomError.badRequest(error);
    }
    console.log( "DTO: ", typeof dto);
    const exists = await this.repository.exists( dto!.dni );
    console.log("=>UseCase: Patient exists:", exists);
    if ( !exists ) {
      console.error("=>UseCase: Patient does not exist.");
      throw CustomError.notFound(`Patient with DNI ${dto!.dni} not found`);
    }
    try {
      const result = await this.repository.delete( dto!.dni );
      if ( !result ) {
        console.error("=>UseCase: Error deleting patient:", error);
        throw CustomError.internalServerError();
      }
    } catch (error) {
      console.error("=>UseCase: Error deleting patient:", error);
      throw CustomError.internalServerError("Error deleting patient");
    }
    return Promise.resolve(true);
  }
}