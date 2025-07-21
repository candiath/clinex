import { DoctorDTO } from "../../dtos/doctor/doctor.dto";
import { CustomError } from "../../errors/customErrors";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class UpdateDoctorUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( data: any ) {

    const validationError = ValidationHelper.validateEntityID( data.id );
    if ( validationError ) throw CustomError.badRequest( validationError );

    const existingDoctor = await this.repository.findById( data.id );
    if ( !existingDoctor ) throw CustomError.notFound();

    const [ error, dto ] = DoctorDTO.validate( data );
    if ( error ) throw CustomError.badRequest( error );

    // Update the doctor with the new data
    const updatedDoctor = await this.repository.update(existingDoctor.id!, dto!);

    return updatedDoctor;
  }
}