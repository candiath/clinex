import { Request, Response } from "express";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
// import { PatientMySQLDatasource } from "../../infrastructure/datasources/MySQL/patient.datasource.implementation"; // To use MySQL
import { CreatePatientUseCase } from "../../domain/usecases/patient/createPatient.useCase";
import { DeletePatientUseCase } from "../../domain/usecases/patient/deletePatient.useCase";
import { ReadAllPatientsUseCase } from "../../domain/usecases/patient/readAllPatients.useCase";
import { UpdatePatientUseCase } from "../../domain/usecases/patient/updatePatient.useCase";
import { ReadPatientByIdUseCase } from "../../domain/usecases/patient/readPatientById.useCase";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { PatientMySQLDatasource } from "../../infrastructure/datasources/MySQL/patient.datasource.implementation";
import { PatientDTO } from "../../domain/dtos/patient/patient.dto";

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
    const [, dto] = PatientDTO.validate(req.body);
    const result = await createPatientUseCase.execute(dto!);
    res.status(201).json(ApiResponse.success(result, "Patient created successfully"));
  };

  getPatientById = async (req: Request, res: Response): Promise<void> => {
    const IDdto= PatientDTO.validateID(req.params.id);
    const result = await readPatientByIdUseCase.execute(IDdto);
    const responseEnvelope = ApiResponse.success(result, "Patient fetched successfully");
    res.status(200).json(responseEnvelope);
    return;
  };

  getAllPatients = async (req: Request, res: Response): Promise<void> => {
    const patients = await readAllPatientsUseCase.execute();
    const responseEnvelope = ApiResponse.success(patients, "Patients retrieved successfully");
    res.status(200).json(responseEnvelope);
    return;
  };

  updatePatient = async (req: Request, res: Response): Promise<void> => {
    const id = PatientDTO.validateID(req.params.id);
    const [, dto] = PatientDTO.validate(req.body);
    const result = await updatePatientUseCase.execute(id!, dto!);
    res.status(200).json(ApiResponse.success(result, "Patient updated successfully"));
    return;
  };

  deletePatient = async (req: Request, res: Response): Promise<void> => {
    const id = PatientDTO.validateID(req.params.id);
    const result = await deletePatientUseCase.execute(id);
    const responseEnvelope = ApiResponse.success(result, "Patient deleted successfully");
    res.status(200).json(responseEnvelope);
    return;
  };
}
