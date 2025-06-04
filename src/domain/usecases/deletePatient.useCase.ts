import { PatientDatasource } from "../datasources/patientDatasource";

export class DeletePatientUseCase {
  constructor( private readonly repository: PatientDatasource ){}

  public async execute( id: string ): Promise< void > {
    // console.log('deleting ', id)
    // TODO: if ( !acknowledged ) throw error;
    //       return deletedCount ?
    await this.repository.delete( id );
  }
}