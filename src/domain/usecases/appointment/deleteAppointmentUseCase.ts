import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { EntityID } from "../../valueObjects/entityID";


export class DeleteAppointmentUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: any) {
    let validID: EntityID;
    try {
      validID = EntityID.create(id);
    } catch (error) {
      throw CustomError.badRequest((error as CustomError).message);
    }
    return this.repository.delete(validID);
  }
}