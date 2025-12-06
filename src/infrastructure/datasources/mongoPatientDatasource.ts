import { Types } from "mongoose";
import { PatientModel } from "../../data/mongo/models/patient.model";
import { PatientDatasource } from "../../domain/datasources/patientDatasource";
import { Patient } from "../../domain/entities/patient.entity";
import { PatientDTO } from "../../domain/dtos/patient/patient.dto";


export class MongoPatientDatasource implements PatientDatasource {
  async findById(id: string): Promise<Patient | null> {
    const result = await PatientModel.findOne({_id: id});
    // console.log('MongoDatasource: findById', id, result);
    if (result) {
      return Promise.resolve(result as Patient);
    } 
    return Promise.resolve(null);
  }

  async findByDni(dni: string): Promise<Patient | null> {
    console.log('MongoDatasource: findByDni', dni);
    // console.log(typeof dni, dni);
    const result = await PatientModel.findOne({ dni });
    // console.log('MongoDatasource: findByDni', result);
    // console.log('|\n' + result + '|\n');
    if ( result ) return Promise.resolve( result as Patient );
    return Promise.resolve(null);
  }

  async save(patient: Patient): Promise<Patient | null> {
    // console.log('MongoDatasource: save', patient);
    // const found = await this.findByDni(patient.dni);
    // if (found) {
      // console.error('=> MongoDatasource: Patient already exists. Aborting save operation.');
      // return Promise.reject(new Error('Patient already exists'));
    // }
    const newPatient = await PatientModel.create( patient );
    console.log('PatientMode.create:', newPatient);
    await newPatient.save();
    // console.log(newPatient);
    return Promise.resolve(newPatient as Patient);
  }

  async update(id: string, newPatientData: PatientDTO): Promise< boolean > {
    const result = await PatientModel.updateOne({ _id: id }, { $set: newPatientData });
    // console.log('MongoDatasource: update result', result);
    console.log('MongoDatasource: update', id, newPatientData);
    /**
     * {
     *  acknowledged: true,
     *  modifiedCount: 1,
     *  upsertedId: null,
     *  upsertedCount: 0,
     *  matchedCount: 1
     *  }
     */
    if (result.acknowledged) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async delete(id: string): Promise<boolean> {
    // console.log('MongoDatasource: delete', id);
    const result = await PatientModel.deleteOne({dni: id});
    // console.log(result)
    /** { acknowledged: true, deletedCount: 1 } */
    if ( result.deletedCount ) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async list(): Promise<Patient[]> {
    const result = await PatientModel.find().lean();
    // -----------------------------------------------
    // const sanitizedResult = result.map((patient) => {
    //   const { __v, ...sanitizedPatient } = patient;
    //   return sanitizedPatient;
    // });
    //TODO: change this to a DTO
    // -----------------------------------------------
    if (result && result.length > 0) {
      return Promise.resolve(result as Patient[]);
    }
    return Promise.resolve([]);
  }

  async exists(dni: string): Promise<boolean> {
    // console.log('MongoDatasource: exists', dni);
    const result = await PatientModel.exists({ dni });
    // console.log('MongoDatasource: exists', result);
    if (result) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}