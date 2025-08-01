import { CustomError } from "../../errors/customErrors";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class ReadDoctorByIdUseCase {

  constructor( readonly repository: DoctorRepository ){}

  public async execute ( data: any ) {

    const error = ValidationHelper.validateEntityID( data.id );
    if ( error ) throw CustomError.badRequest( error );

    let existingDoctor;
    try {
      existingDoctor = await this.repository.findById( data.id);
    } catch (error) {
      throw CustomError.internalServerError("Error fetching doctor from DB");
    }

    if ( !existingDoctor ) throw CustomError.notFound("Doctor not found");
    return existingDoctor;
  }
}