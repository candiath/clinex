import { Doctor } from "../../entities/doctor.entity";
import { DoctorRepository } from "../../repositories/doctorRepository";

export class ReadAllDoctorsUseCase {

  constructor( readonly repository: DoctorRepository ){}

  public async execute (): Promise<Doctor[]> {

    // const [ error, dto ] = await DoctorDTO.validate( data ); 
    // if ( error ) throw CustomError.badRequest( error );
    const query = await this.repository.list();

    return query;

  }
}