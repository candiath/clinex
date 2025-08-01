import { DoctorDTO } from "../../dtos/doctor/doctor.dto";
import { CustomError } from "../../errors/customError";
import { DoctorRepository } from "../../repositories/doctorRepository";



export class ReadAllDoctorsUseCase {

  constructor( readonly repository: DoctorRepository ){}

  public async execute ( data: any ) {

    // const [ error, dto ] = await DoctorDTO.validate( data ); 
    // if ( error ) throw CustomError.badRequest( error );
    const query = await this.repository.list();

    return query;

  }
}