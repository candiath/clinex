import { Request, Response } from "express";
import { CreatePatientDTO } from "../../domain/dtos/createPatient.dto";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { MongoPatientDatasource } from "../../infrastructure/datasources/mongoPatientDatasource";
import { Patient } from "../../domain/entities/patient";
import { UpdatePatientDTO } from "../../domain/dtos/updatePatient.dto";
import { CreatePatientUseCase } from "../../domain/usecases/createPatient.useCase";
import { CustomError } from "../../domain/errors/customErrors";
import { DeletePatientDTO } from "../../domain/dtos/deletePatient.dto";
import { DeletePatientUseCase } from "../../domain/usecases/deletePatient.useCase";
import { ReadAllPatientsUseCase } from "../../domain/usecases/readAllPatients.useCase";

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   res.status(200).json({"message": "Hello World!"});
// })

// export const PatientRouter = router;
const repo = new PatientRepoImplementation(new MongoPatientDatasource());
const createPatientUseCase = new CreatePatientUseCase(repo);
const deletePatientUseCase = new DeletePatientUseCase(repo);
const readAllPatientsUseCase = new ReadAllPatientsUseCase(repo);

export class PatientController {
  // constructor(){}

  createPatient = async (req: Request, res: Response) => {

    let result;
    try {
      result = await createPatientUseCase.execute(req);
      await console.log('PatientController: createPatient result', result);
    } catch (error) {
      ( error instanceof CustomError )
        ? res.status( error.statusCode ).json({ error: error.message })
        // : res.status(501).json({ error: "Internal Server Error" });
        : res.status(501).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
      return;
    }

    res.status(201).json(result);
  };

  getPatients = async (req: Request, res: Response) => {
    const patients = await readAllPatientsUseCase.execute();
    if ( !patients || patients.length === 0 ) {
      res.status(204).json({ error: "No patients found" });
      return;
    }
    res.status(200).json(patients);
  };

  getPatientByDni = async (req: Request, res: Response) => {
    const dni = req.params.dni;
    // console.log('getPatientByDni', dni);
    if (dni === "") {
      res.status(400).json({ error: "DNI is required" });
      return;
    }
    const patient = await repo.findByDni(dni);
    if (!patient) {
      res.status(404).json({ error: `Patient with DNI ${dni} not found` });
      return;
    }
    res.status(200).json(patient);
  };

  deletePatientByDni = async (req: Request, res: Response) => {
    let result;
    try {
      console.log('deletePatientByDni', req.params);
      result = await deletePatientUseCase.execute( req );
      console.log('deletePatientByDni result', result);
    } catch (error) {
      if ( error instanceof CustomError ) {
        res.status( error.statusCode ).json( {error: error.message} )
        return;
      } else {
        res.status(501).json({ error: error instanceof Error ? error.message : 'Internal server error'})
        return;
      }
    }
    if ( result ) {
      res.status(204).json({ message: "Patient deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete patient" });
    }
  };

  updatePatientByID = async (req: Request, res: Response) => {
    const id = req.params.id;
    const [error, updatePatientDTO] = await UpdatePatientDTO.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    // console.log('updatePatientByDni', updatePatientDTO);
    if (!updatePatientDTO) {
      res.status(400).json({ error: "Update data is required" });
      return;
    }
    const patient = await repo.findById(id);
    if (!patient) {
      res.status(404).json({ error: `Patient with ID ${id} not found` });
      return;
    }
    // console.log('updatePatientByDni', updatePatientDTO);
    const updatedPatient = await repo.update(id, updatePatientDTO);
    // console.log('updatedPatient', updatedPatient);
    if (updatedPatient) {
      res.status(200).json({ updatedPatient });
    } else {
      res.status(500).json({ error: "Failed to update patient" });
    }
  };
}
