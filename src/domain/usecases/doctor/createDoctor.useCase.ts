import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customErrors";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { DoctorDTO } from "../../dtos/doctor/doctor.dto";

export class CreateDoctorUseCase {

  constructor( private readonly repository: DoctorRepository ) {
    this.repository = repository;
  }

  public async execute ( data: any ) {

    const [ error, dto ] = DoctorDTO.validate( data );
    if ( error ) {
      throw CustomError.badRequest(error);
    }
    if ( !dto!.name ) throw CustomError.badRequest('Doctor name is required');
    if ( !dto!.specialty ) throw CustomError.badRequest('Doctor specialty is required');
    if ( !dto!.email ) throw CustomError.badRequest('Doctor email is required');
    if ( !dto!.phone ) throw CustomError.badRequest('Doctor phone is required');

    const doctor = Doctor.create(
      dto!.name,
      dto!.specialty,
      dto!.email,
      dto!.phone,
      dto!.id
    )

    try {
      return this.repository.save( doctor );
    } catch (error) {
      throw CustomError.internalServerError();
    }
  }
}