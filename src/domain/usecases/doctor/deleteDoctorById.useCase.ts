import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { EntityID } from "../../valueObjects/entityID";


export class DeleteDoctorByIdUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( id: any ) {

    const sanitizedData = EntityID.create(id);

    const existingDoctor = await this.repository.findById(sanitizedData);
    if (existingDoctor == null) throw CustomError.notFound("Doctor not found");

    const deleted = await this.repository.delete(sanitizedData);

    return deleted;
  }
}