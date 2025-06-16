import { Types } from "mongoose";
import { PatientModel } from "../../data/mongo/models/patient.model";
import { PatientDatasource } from "../../domain/datasources/patientDatasource";
import { Patient } from "../../domain/entities/patient";


export class MongoPatientDatasource implements PatientDatasource {
  async findById(id: string): Promise<Patient | null> {
    const result = await PatientModel.findOne({id});
    if (result) {
      return Promise.resolve(result as Patient);
    } 
    return Promise.resolve(null);
  }

  async findByDni(dni: string): Promise<Patient | null> {
    console.log('MongoDatasource: findByDni', dni);
    const result = await PatientModel.findOne({ dni });
    console.log('MongoDatasource: findByDni', result);
    // console.log('|\n' + result + '|\n');
    if ( result ) return Promise.resolve( result as Patient );
    return Promise.resolve(null);
  }

  async save(patient: Patient): Promise<Patient | null> {
    // console.log('MongoDatasource: save', patient);
    const found = await this.findByDni(patient.dni);
    if (found) {
      console.error('=> MongoDatasource: Patient already exists. Aborting save operation.');
      return Promise.reject(new Error('Patient already exists'));
    }
    const newPatient = await PatientModel.create( patient );
    // console.log('Patient created:', newPatient);
    await newPatient.save();
    console.log(newPatient);
    return Promise.resolve(newPatient as Patient);
  }

  async update(patient: Patient): Promise< boolean > {
    const result = await PatientModel.updateOne( patient );
    // console.log(result);
    /**
     * {
     *  acknowledged: true,
     *  modifiedCount: 1,
     *  upsertedId: null,
     *  upsertedCount: 0,
     *  matchedCount: 1
     *  }
     */
    if (result.modifiedCount) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async delete(id: string): Promise<boolean> {
    // const result = await PatientModel.deleteOne({ _id: new Types.ObjectId(id)});
    const result = await PatientModel.deleteOne({id});
    // console.log(result)
    /** { acknowledged: true, deletedCount: 1 } */
    if ( result.deletedCount ) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async list(): Promise<Patient[]> {
    return await PatientModel.find();
  }

}