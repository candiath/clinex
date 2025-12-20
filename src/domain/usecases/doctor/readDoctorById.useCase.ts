import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
// import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { EntityID } from "../../valueObjects/entityID";


export class ReadDoctorByIdUseCase {

  constructor( readonly repository: DoctorRepository ){}

  public async execute ( data: EntityID ): Promise<Doctor> {

    // const error = ValidationHelper.isEntityIDNotValid( data.id );
    // if ( error ) throw CustomError.badRequest( error );

    let existingDoctor;
    try {
      existingDoctor = await this.repository.findById( data);
    } catch (error) {
      throw CustomError.internalServerError("Error fetching doctor from DB");
    }

    if ( !existingDoctor ) throw CustomError.notFound("Doctor not found");
    return existingDoctor;
  }
}