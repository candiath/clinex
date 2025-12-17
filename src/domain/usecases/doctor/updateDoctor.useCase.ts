import { DoctorDTO } from "../../dtos/doctor/doctor.dto";
import { CustomError } from "../../errors/customError";
import { DoctorRepository } from "../../repositories/doctorRepository";


export class UpdateDoctorUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( id: number, data: DoctorDTO ) {

    if (!id) throw CustomError.badRequest("ID not provided");

    const existingDoctor = await this.repository.findById( id );
    if ( !existingDoctor ) throw CustomError.notFound();

    // Update the doctor with the new data
    const updatedDoctor = await this.repository.update(existingDoctor.id!, data);

    return updatedDoctor;
  }
}