import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class DeleteDoctorByIdUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( id: any ) {

    const validation = ValidationHelper.isEntityIDNotValid( id );

    if ( validation ) throw CustomError.badRequest( validation ); 

    const existingDoctor = await this.repository.findById(id);
    if (!existingDoctor) throw CustomError.notFound("Doctor not found");

    const deleted = await this.repository.delete(id);

    return deleted;
  }
}