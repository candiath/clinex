import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
import { DoctorInterface } from "../../interfaces/doctor.interfaces";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { EntityID } from "../../valueObjects/entityID";


export class UpdateDoctorUseCase {
  constructor( readonly repository: DoctorRepository ){}

  public async execute ( id: EntityID, newData: DoctorInterface ): Promise<Doctor | null> {

    const existingDoctor = await this.repository.findById( id );
    if ( !existingDoctor ) throw CustomError.notFound();

    // Prepare the data to be updated
    const data: DoctorInterface = {
      name: newData.name ?? existingDoctor.name,
      specialty: newData.specialty ?? existingDoctor.specialty,
      email: newData.email ?? existingDoctor.email,
      phone: newData.phone ?? existingDoctor.phone,
    };

    // validate/create entity using positional args expected by Doctor.create
    Doctor.create(data.name, data.specialty, data.email, data.phone);

    // Update the doctor with the new data
    // TODO: Consider handling partial updates in the repository layer
    const updatedDoctor = await this.repository.update(existingDoctor.id!, data);

    return updatedDoctor;
  }
}