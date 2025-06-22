import { envs } from "./config/plugins/envs.plugin";
import { PatientModel } from "./data/mongo/models/patient.model";
import { MongoDatabase } from "./data/mongo/mongo.init";
import { Patient } from "./domain/entities/patient";
import { CreatePatientUseCase } from "./domain/usecases/createPatient.useCase";
import { DeletePatientUseCase } from "./domain/usecases/deletePatient.useCase";
import { ReadAllPatientsUseCase } from "./domain/usecases/readAllPatients.useCase";
import { MongoPatientDatasource } from "./infrastructure/datasources/mongoPatientDatasource";
import { PatientRepoImplementation } from "./infrastructure/repositories/patientRepositoryImplementation";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(()=>{main()})()

async function main() {
  // console.log('Hello, World!!!');

  await MongoDatabase.connect({
    mongoURL: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  
  const server = new Server( {
    port: envs.PORT,
    routes: AppRoutes.routes,
    publicPath: 'public'
  });

  server.start();

  

  // const patient = await PatientModel.create({
  //   id: '123',
  //   dni: '12345678A',
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   birthDate: new Date('1990-01-01'),
  //   email: 'john.doe@example.com',
  //   sex: 'male',
  // });

  // const patient2 = await PatientModel.create({
  //   id: '456',
  //   dni: '87654321B',
  //   firstName: 'Jane',
  //   lastName: 'Doe',
  //   birthDate: new Date('1992-02-02'),
  //   email: 'jane.doe@example.com',
  //   sex: 'female',
  // });

  // const patient3 = new Patient(
  //   '789',
  //   '87654321C',
  //   'Damian',
  //   'Teky',
  //   new Date('1993-02-02'),
  //   'daniteki@example.com',
  //   'other',
  // );

  // console.log('Patient created:', patient3);

  // const datasource = new MongoPatientDatasource;
  // const repo = new PatientRepoImplementation( datasource );
  // const createPatient = new CreatePatientUseCase( repo );
  // await createPatient.execute( patient3 );

  // const readPatients = new ReadAllPatientsUseCase( repo );
  // const list = await readPatients.execute();
  // console.log( list )
  // console.log('hola');
  // const paciente = await datasource.findById('789');
  // const paciente = await datasource.findByDni('8765s4321C');
  // paciente!.email = 'JAIMITO@RISAS.COM';
  // datasource.update(paciente as Patient)
  // const deletePatient = new DeletePatientUseCase( repo );
  // await deletePatient.execute('789')

  // console.log( await datasource.update( paciente as Patient))
}