import { Request, Response } from "express";
import { CreatePatientDTO } from "../../domain/dtos/createPatient.dto";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { MongoPatientDatasource } from "../../infrastructure/datasources/mongoPatientDatasource";
import { Patient } from "../../domain/entities/patient";

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   res.status(200).json({"message": "Hello World!"});
// })


// export const PatientRouter = router;
const repo = new PatientRepoImplementation(new MongoPatientDatasource());
export class PatientController {

  // constructor(){}

  createPatient = async (req: Request, res: Response) => {
    // const data = req.body;
    const [error, patientDTO] = CreatePatientDTO.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    // console.log('patientDTO', patientDTO);
    
    let createPatient; 
    try {
      createPatient = await repo.save(patientDTO as Patient);
      
    } catch (error) {
      console.log('createPatient', typeof(createPatient));
      console.error("Error saving patient:", error);
      if (error instanceof Error) {
        res.status(502).json({ error: error.message });
      } else {
        res.status(501).json({ error: `${error}` });
      }
      return;
    }
    res.json({ error, patient: createPatient });
  }

  getPatients = async (req: Request, res: Response) => {
    res.json({"source": "getPatients", "timestamp": new Date(),});
  }
}