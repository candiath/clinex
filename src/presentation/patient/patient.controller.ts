import { Request, Response } from "express";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { MongoPatientDatasource } from "../../infrastructure/datasources/mongoPatientDatasource";
// import { PatientMySQLDatasource } from "../../infrastructure/datasources/MySQL/patient.datasource.implementation"; // To use MySQL
import { CreatePatientUseCase } from "../../domain/usecases/patient/createPatient.useCase";
import { CustomError } from "../../domain/errors/customError";
import { DeletePatientUseCase } from "../../domain/usecases/patient/deletePatient.useCase";
import { ReadAllPatientsUseCase } from "../../domain/usecases/patient/readAllPatients.useCase";
import { UpdatePatientUseCase } from "../../domain/usecases/patient/updatePatient.useCase";
import { ReadPatientByIdUseCase } from "../../domain/usecases/patient/readPatientById.useCase";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { PatientMySQLDatasource } from "../../infrastructure/datasources/MySQL/patient.datasource.implementation";

// Currently using MongoDB - to switch to MySQL, uncomment the import above and change this line:
// const repo = new PatientRepoImplementation(new MongoPatientDatasource());
const repo = new PatientRepoImplementation(new PatientMySQLDatasource()); // Use this for MySQL

const createPatientUseCase = new CreatePatientUseCase(repo);
const readPatientByIdUseCase = new ReadPatientByIdUseCase(repo);
const readAllPatientsUseCase = new ReadAllPatientsUseCase(repo);
const deletePatientUseCase = new DeletePatientUseCase(repo);
const updatePatientUseCase = new UpdatePatientUseCase(repo);

export class PatientController {
  createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await createPatientUseCase.execute(req.body);
      res.status(201).json(ApiResponse.success(result, "Patient created successfully"));
    } catch (error) {
      console.error("====> Controller: Error creating patient:", error);
      const errorResponse = ApiResponse.error(error, "Creating patient");
      
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(errorResponse);
        return;
      }
      res.status(500).json(errorResponse);
    }
  };

  getPatientById = async (req: Request, res: Response): Promise<void> => {
    let result;
    let responseEnvelope;
    try {
      result = await readPatientByIdUseCase.execute(req.params);
    } catch (error) {
      responseEnvelope = ApiResponse.error(error, "Getting patient by id");

      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
      return;
    }
    responseEnvelope = ApiResponse.success(result, "Patient fetched successfully");
    res.status(200).json(responseEnvelope);
  };

  getAllPatients = async (req: Request, res: Response): Promise<void> => {
    let responseEnvelope;
    try {
      const patients = await readAllPatientsUseCase.execute();
      responseEnvelope = ApiResponse.success(patients, "Patients retrieved successfully");
      res.status(200).json(responseEnvelope);
    } catch (error) {
      responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
  };

  updatePatient = async (req: Request, res: Response): Promise<void> => {
    let result;
    let responseEnvelope;

    try {
      const data = { id: req.params.id, ...req.body };
      result = await updatePatientUseCase.execute(data);
    } catch (error) {
      responseEnvelope = ApiResponse.error(error, "Error updating patient");
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
      return;
    }
    if (!result) {
      responseEnvelope = ApiResponse.error(CustomError.notFound("Patient not found"));
      res.status(404).json(responseEnvelope);
      return;
    }
    res.status(200).json(ApiResponse.success(result, "Patient updated successfully"));
  };

  deletePatient = async (req: Request, res: Response): Promise<void> => {
    let result;
    let responseEnvelope;
    try {
      result = await deletePatientUseCase.execute(req.params);
      if (!result) {
        responseEnvelope = ApiResponse.error(CustomError.notFound(), `Patient with id ${req.params.id} not found`);
        res.status(404).json(responseEnvelope);
        return;
      }
      responseEnvelope = ApiResponse.success(null, "Patient deleted successfully");
      res.status(200).json(responseEnvelope);
    } catch (error) {
      responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
  };
}
