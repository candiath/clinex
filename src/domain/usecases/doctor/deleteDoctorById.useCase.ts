import { CustomError } from "../../errors/customError";
import { EntityIDSchema } from "../../interfaces/dataSchemas.interfaces";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { EntityID } from "../../valueObjects/entityID";

export class DeleteDoctorByIdUseCase {
  constructor(readonly repository: DoctorRepository) {}

  public async execute(id: EntityID): Promise<boolean> {
    const parsedID = EntityIDSchema.safeParse(id);
    if (!parsedID.success) throw CustomError.badRequest(parsedID.error.message, {location: "DeleteDoctorByIdUseCase"});
    const existingDoctor = await this.repository.findById(EntityID.validate(parsedID.data!));
    if (existingDoctor == null)
      throw CustomError.notFound("Doctor not found", {
        location: "DeleteDoctorByIdUseCase",
      });

    return await this.repository.delete(EntityID.validate(parsedID.data!));
  }
}
