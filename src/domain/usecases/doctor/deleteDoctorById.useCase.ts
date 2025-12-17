import { CustomError } from "../../errors/customError";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class DeleteDoctorByIdUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( id: number ) {


    const existingDoctor = await this.repository.findById(id);
    if (existingDoctor == null) throw CustomError.notFound("Doctor not found");

    const deleted = await this.repository.delete(id);

    return deleted;
  }
}