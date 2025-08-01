import { Request, Response } from "express";
import { CreatePatientDTO } from "../../domain/dtos/createPatient.dto";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { MongoPatientDatasource } from "../../infrastructure/datasources/mongoPatientDatasource";
import { Patient } from "../../domain/entities/patient";
import { UpdatePatientDTO } from "../../domain/dtos/updatePatient.dto";
import { CreatePatientUseCase } from "../../domain/usecases/createPatient.useCase";
import { CustomError } from "../../domain/errors/customError";
import { DeletePatientDTO } from "../../domain/dtos/deletePatient.dto";
import { DeletePatientUseCase } from "../../domain/usecases/deletePatient.useCase";
import { ReadAllPatientsUseCase } from "../../domain/usecases/readAllPatients.useCase";
import { ReadPatientByDniUseCase } from "../../domain/usecases/readPatientByDni.useCase";
import { PublicPatientDTO } from "../../domain/dtos/publicPatient.dto";
import { Types } from "mongoose";
import { UpdatePatientUseCase } from "../../domain/usecases/updatePatient.useCase";
import { ReadPatientByIdUseCase } from "../../domain/usecases/readPatientById.useCase";
import { PatientInterface } from "../../domain/interfaces/patient.interface";

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
      let data: PatientInterface;
      // Copy the request body to a new object
      if ( req.body && Object.keys(req.body).length > 0 ) {
        // console.log('PatientController: createPatient called with body', req.body);
        data = { ...req.body };
        // console.log('Data copied from request body:', data);
        result = await createPatientUseCase.execute(data);
        // console.log('PatientController: createPatient result', result);
      } else {
        console.log('PatientController: createPatient called without body');
        throw CustomError.badRequest("Request body is required for creating a patient");
      }
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


    console.log('PatientController: getPatients called with params', req.params);
    console.log('PatientController: getPatients called with query', req.query);
    
      // DNI
    if ( Object.keys(req).length > 0 && req.query && req.query.dni  ) {
      // console.log('PatientController: getPatients called with query query', req.query);
      let result, data;
      try {
          // console.log('PatientController: getPatients called with DNI', req.query.dni);
          data = { ...req.query };
          result = await readPatientByDniUseCase.execute( data );
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
        res.status(400).json({ error: `Patient with DNI ${ data.dni } not found`});
        return;
      }
    }
    /**
     * FIXME: FIXME: FIXME: 
     * REFACTOR SEARCH BY DNI.
     * FIXME: FIXME: FIXME: 
     */


    // let data: PatientInterface;
    try {
      if ( req.body && Object.keys(req.body).length > 0) {
        // data = { ...req.body };
        // console.log('PatientController: getPatients called with body', req.body);
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

    // ID 
    if ( Object.keys(req.params).length > 0 && req.params && req.params.id ) {
      console.log('PatientController: getPatients called with params params', req.params);
      let result, data;
      try {
        data = { id: req.params.id as string };
        if ( Types.ObjectId.isValid( data.id ) ) {
          result = await readPatientByIdUseCase.execute( data.id );
        } else {
          throw CustomError.badRequest(`Invalid ID format: ${data.id}`);
        }
      } catch ( error ) {
        if ( error instanceof CustomError ) {
          res.status( error.statusCode ).json( { error: error.message } );
          return;
        } else {
          res.status(501).json({ error: error instanceof CustomError ? error.message : 'Internal server error'});
          return;
        }
      }
      // console.log('PatientController: getPatients RESULT', result);
      if ( result ) {
        const publicPatient = PublicPatientDTO.fromPatient(result)
        res.status(200).json(publicPatient);
        return;
      } else {
        //TODO: verificar si es DNI o ID
        res.status(400).json({ error: `Patient with ID ${ data.id } not found`});
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

  getPatientByDni = async (req: Request, res: Response) => {
    // console.log('getPatientByDni', dni);

    // TODO: put this in a middleware

    if ( req.body && Object.keys(req.body).length > 0 ) {
      res.status(400).json({ 
        error: "GET method does not expect a body. Use parameters instead."
      });
      return;
    }

    let result;
    let data;
    try {
      data = { dni: req.params.dni as string, ...req.params };
      result = await readPatientByDniUseCase.execute( data );
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
      res.status(404).json({ error: `Patient with DNI XDXDX${ data.dni } not found` });
    }
  };

  deletePatientByDni = async (req: Request, res: Response) => {
    let result, data;
    try {
      data = { ...req.params};
      if ( data.dni ) {
        result = await deletePatientUseCase.execute( data );
      } else {
        // todo: check this message
        throw CustomError.badRequest("DNI parameter is required for deletion");
        throw CustomError.badRequest(`Invalid DNI format: ${ data.dni }`);
      }
    } catch (error) {
      console.log('PatientController: deletePatientByDni error', error);
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
    // const { id } = req.params;
    if ( req.params.id && Object.keys(req.params).length > 1 ) {
      res.status(400).json({ error: "PUT method does not expect params. Use body instead." });
      return;
    }
    let data = { id: req.params.id, ...req.body };
    console.log('PatientController: updatePatientByID called with params', req.params);
    try {
      // data = { ...req.params };
      if ( !Types.ObjectId.isValid(data.id) ) {
        throw CustomError.badRequest(`Invalid ID format: ${data.id}`);
      }
    } catch (error) {
      if ( error instanceof CustomError ) {
        res.status( error.statusCode ).json( {error: error.message} )
        return;
      } else {
        res.status(501).json({ error: error instanceof Error ? error.message : 'Internal server error'})
        return;
      }
    }
    // if ( !data.id || !Types.ObjectId.isValid(data.id) ) {
    //   res.status(400).json({ error: "ID parameter is required" });
    //   return;
    // }
    // data = { ...req.body };
    if ( !req.body || Object.keys(req.body).length === 0 ) {
      res.status(400).json({ error: "Request body is required for update" });
      return;
    }

    const result = await updatePatientUseCase.execute( data );
    if ( !result ) {
      res.status(404).json({ error: `Patient with id ${data.id} not found` });
      return;
    }
    res.status(200).json({ message: "Patient updated successfully" });
  };
}
