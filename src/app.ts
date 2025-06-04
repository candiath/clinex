import { envs } from "./config/plugins/envs.plugin";
import { PatientModel } from "./data/mongo/models/patient.model";
import { MongoDatabase } from "./data/mongo/mongo.init";

(()=>{main()})()

async function main() {
  console.log('Hello, World!!!');

  await MongoDatabase.connect({
    mongoURL: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  
  const patient = await PatientModel.create({
    id: '123',
    dni: '12345678A',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@example.com',
    sex: 'male',
  });

  console.log('Patient created:', patient);

  await patient.save();
}