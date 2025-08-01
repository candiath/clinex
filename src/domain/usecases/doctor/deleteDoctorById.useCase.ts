import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class DeleteDoctorByIdUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( data: any ) {

    const validation = ValidationHelper.validateEntityID( data.id );

    if ( validation ) throw CustomError.badRequest( validation ); 

    const existingDoctor = await this.repository.findById(data.id);
    if (!existingDoctor) throw CustomError.notFound("Doctor not found");

    const deleted = await this.repository.delete(data.id);

    return deleted;
  }
}