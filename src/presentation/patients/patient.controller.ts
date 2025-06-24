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
import { ReadPatientByIdUseCase } from "../../domain/usecases/readPatientById.useCase";

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
const readPatientByIdUseCase = new ReadPatientByIdUseCase(repo); // Assuming this is the same as reading by DNI, adjust if needed

  
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

    console.log('PatientController: getPatients called with query', req.query);
    try {
      // console.log('req.body', req.body);
      if ( req.body && Object.keys(req.body).length > 0 ) {
        console.log('PatientController: getPatients called with body', req.body);
        throw CustomError.badRequest('Get method does not accept body. Use query parameters instead');
      }
      } catch ( error ) {
        if ( error instanceof CustomError ) {
          res.status( error.statusCode ).json( error.message );
          return;
        } else {
          console.log(error);
          res.status(500).json('Internal server error');
          return;
        }
      }
    
      // DNI
    if ( req.query && req.query.dni && Object.keys(req).length > 0 ) {
      // console.log('PatientController: getPatients called with query params', req.query);
      let result;
      try {
        result = await readPatientByDniUseCase.execute( req.query.dni as string );
      } catch ( error ) {
        if ( error instanceof CustomError ) {
          res.status( error.statusCode ).json( error.message );
          return;
        } else {
          res.status(501).json({ error: error instanceof CustomError ? error.message : 'Internal server error'});
          return;
        }
      }
      if ( result ) {
        const publicPatient = PublicPatientDTO.fromPatient(result)
        res.status(200).json(publicPatient);
        return;
      } else {
        //TODO: verificar si es DNI o ID
        res.status(400).json({ error: `Patient with id ${req.params.dni} not found`});
        return;
      }
    }
    // ID 
    if ( req.query && req.query.id && Object.keys(req.query).length > 0 ) {
      // console.log('PatientController: getPatients called with query params', req.query);
      let result;
      try {
        result = await readPatientByIdUseCase.execute( req.query.id as string );
      } catch ( error ) {
        if ( error instanceof CustomError ) {
          res.status( error.statusCode ).json( error.message );
          return;
        } else {
          res.status(501).json({ error: error instanceof CustomError ? error.message : 'Internal server error'});
          return;
        }
      }
      if ( result ) {
        const publicPatient = PublicPatientDTO.fromPatient(result)
        res.status(200).json(publicPatient);
        return;
      } else {
        //TODO: verificar si es DNI o ID
        res.status(400).json({ error: `Patient with id ${req.params.dni} not found`});
        return;
      }
    }

    // Get All Patients
    console.log('PatientController: getPatients called');
    let patients;
    try {
      patients = await readAllPatientsUseCase.execute();
    } catch ( error ) {
      if ( error instanceof CustomError ){
        res.send( error.statusCode ).json( error.message );
        return;
      } else {
        res.send(501).json({ error: 'Internal server error' });
        return;
      }
    }
    const sanitizedPatients = patients!.map((patient: Patient) => 
      PublicPatientDTO.fromPatient(patient));
    res.status(200).json( sanitizedPatients );
    return;

  };

  // getPatientByDni = async (req: Request, res: Response) => {
  //   // console.log('getPatientByDni', dni);
  //   if ( req.body && Object.keys(req.body).length > 0 ) {
  //     res.status(400).json({ 
  //       error: "GET method does not expect a body"
  //     });
  //     return;
  //   }

  //   let result;
  //   try {
  //     result = await readPatientByDniUseCase.execute( req );
  //   } catch ( error ) {
  //     if ( error instanceof CustomError ) {
  //       res.status( error.statusCode ).json( {error: error.message} )
  //       return;
  //     } else {
  //       res.status(501).json({ error: error instanceof Error ? error.message : 'Internal server error'})
  //       return;
  //     }
  //   }
  //   if (result) {
  //     // console.log('getPatientByDni result', result);
  //     const publicPatient = PublicPatientDTO.fromPatient(result);
  //     res.status(200).json(publicPatient);
  //   }
  //   else {
  //     res.status(404).json({ error: `Patient with id ${req.params.dni} not found` });
  //   }
  // };

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
