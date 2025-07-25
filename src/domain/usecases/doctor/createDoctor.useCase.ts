import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customErrors";
import { DoctorRepository } from "../../repositories/doctorRepository";
import { DoctorDTO } from "../../dtos/doctor/doctor.dto";

export class CreateDoctorUseCase {

  constructor( private readonly repository: DoctorRepository ) {
    this.repository = repository;
  }

  public async execute ( data: any ) {

    // console.log(Doctor.getMandatoryFields().toString())
    const [ error, dto ] = DoctorDTO.validate( data );
    if ( error ) throw CustomError.badRequest(error);

    console.log('DTO validated:', dto);
    if ( dto!.name === null || dto!.name === undefined ) throw CustomError.badRequest('Doctor name is required');
    if ( dto!.specialty === null || dto!.specialty === undefined ) throw CustomError.badRequest('Doctor specialty is required');
    if ( dto!.email === null || dto!.email === undefined ) throw CustomError.badRequest('Doctor email is required');
    if ( dto!.phone === null || dto!.phone === undefined ) throw CustomError.badRequest('Doctor phone is required');

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