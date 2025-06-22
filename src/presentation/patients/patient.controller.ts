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
import { ReadPatientByDniUseCase } from "../../domain/usecases/readPatientByDni.useCase";
import { PublicPatientDTO } from "../../domain/dtos/publicPatient.dto";
import { Types } from "mongoose";
import { UpdatePatientUseCase } from "../../domain/usecases/updatePatient.useCase";

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   res.status(200).json({"message": "Hello World!"});
// })

// export const PatientRouter = router;
const repo = new PatientRepoImplementation(new MongoPatientDatasource());
const createPatientUseCase = new CreatePatientUseCase(repo);
const deletePatientUseCase = new DeletePatientUseCase(repo);
const readAllPatientsUseCase = new ReadAllPatientsUseCase(repo);
const readPatientByDniUseCase = new ReadPatientByDniUseCase(repo);
const updatePatientUseCase = new UpdatePatientUseCase(repo);

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
    // try body existence
    if ( req.body && Object.keys(req.body).length > 0 ) {
      res.status(400).json({ 
        error: "GET method does not expect a body"
      });
      return;
    }
    let patients = await readAllPatientsUseCase.execute();


    let publicPatients: PublicPatientDTO[];
    if (patients && patients.length > 0) {
      publicPatients = patients.map((patient: Patient) => PublicPatientDTO.fromPatient(patient));
      res.status(200).json(publicPatients);
      return;
    } else {
      publicPatients = [];
      res.status(204).json({ error: "No patients found" });
      return;
    }

    // const publicPatients = patients!.map((patient: any) => {
    //   return {
    //     id: patient._id,
    //     dni: patient.dni,
    //     firstName: patient.firstName,
    //     lastName: patient.lastName,
    //     birthDate: patient.birthDate,
    //     email: patient.email,
    //     sex: patient.sex,
    //   };
    // });
  };

  getPatientByDni = async (req: Request, res: Response) => {
    // console.log('getPatientByDni', dni);
    if ( req.body && Object.keys(req.body).length > 0 ) {
      res.status(400).json({ 
        error: "GET method does not expect a body"
      });
      return;
    }

    let result;
    try {
      result = await readPatientByDniUseCase.execute( req );
    } catch ( error ) {
      if ( error instanceof CustomError ) {
        res.status( error.statusCode ).json( {error: error.message} )
        return;
      } else {
        res.status(501).json({ error: error instanceof Error ? error.message : 'Internal server error'})
        return;
      }
    }
    if (result) {
      // console.log('getPatientByDni result', result);
      const publicPatient = PublicPatientDTO.fromPatient(result);
      res.status(200).json(publicPatient);
    }
    else {
      res.status(404).json({ error: `Patient with id ${req.params.dni} not found` });
    }
  };

  deletePatientByDni = async (req: Request, res: Response) => {
    let result;
    try {
      result = await deletePatientUseCase.execute( req );
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
    const { id } = req.params;

    if ( !id ) {
      res.status(400).json({ error: "ID parameter is required" });
      return;
    }

    if ( !req.body || Object.keys(req.body).length === 0 ) {
      res.status(400).json({ error: "Request body is required for update" });
      return;
    }

    await updatePatientUseCase.execute(id, req.body);

    res.status(200).json({ message: "Patient updated successfully" });
  };
}
