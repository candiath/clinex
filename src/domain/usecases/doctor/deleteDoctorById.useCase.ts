import { CustomError } from "../../errors/customError";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { EntityID } from "../../valueObjects/entityID";

export class DeleteDoctorByIdUseCase {
  constructor(readonly repository: DoctorRepository) {}

  public async execute(id: EntityID): Promise<boolean> {
    const existingDoctor = await this.repository.findById(id);
    if (existingDoctor == null)
      throw CustomError.notFound("Doctor not found", {
        location: "DeleteDoctorByIdUseCase",
      });

    return await this.repository.delete(id);
  }
}
