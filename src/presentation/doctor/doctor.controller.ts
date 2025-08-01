import { Request, response, Response } from "express";
import { DoctorDTO } from "../../domain/dtos/doctor/doctor.dto";
import { CreateDoctorUseCase } from "../../domain/usecases/doctor/createDoctor.useCase";
import { DoctorRepositoryImplementation } from "../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorMySQLDatasource } from "../../infrastructure/datasources/MySQL/doctor.datasource.implementation";
import { ReadDoctorByIdUseCase } from "../../domain/usecases/doctor/readDoctorById.useCase";
import { CustomError } from "../../domain/errors/customError";
import { ReadAllDoctorsUseCase } from "../../domain/usecases/doctor/readAllDoctors.useCase";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { DeleteDoctorByIdUseCase } from "../../domain/usecases/doctor/deleteDoctorById.useCase";
import { UpdateDoctorUseCase } from "../../domain/usecases/doctor/updateDoctor.useCase";

const repo = new DoctorRepositoryImplementation(new DoctorMySQLDatasource());
const createDoctorUseCase = new CreateDoctorUseCase(repo);
const readDoctorByIdUseCase = new ReadDoctorByIdUseCase( repo );
const readAllDoctorsUseCase = new ReadAllDoctorsUseCase( repo );
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase( repo );
const updateDoctorUseCase = new UpdateDoctorUseCase( repo );


export class DoctorController {
  createDoctor = async (req: Request, res: Response) => {
    try {

      const result = await createDoctorUseCase.execute(req.body);
      console.log(result);
      res.status(201).json({ doctor: result });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.message);
      }
      console.error("====> Controller: Error creating doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getDoctorById = async (req: Request, res: Response) => {
    let result;
    let responseEnvelope;
    try {
      result = await readDoctorByIdUseCase.execute( req.params );

    } catch ( error ) {

      responseEnvelope = ApiResponse.error(error, "Getting doctor by id");

      if ( error instanceof CustomError ) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
    responseEnvelope = ApiResponse.success(result, "Doctor fetched successfully");
    res.status(200).json(responseEnvelope);
  }

  getAllDoctors = async (req: Request, res: Response) => {
    let responseEnvelope;
    try {
      const doctors = await readAllDoctorsUseCase.execute( null );
      responseEnvelope = ApiResponse.success(doctors, "Doctors retrieved successfully");
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

  updateDoctor = async (req: Request, res: Response) => {
    let result;
    let responseEnvelope;

    try {
      result = await updateDoctorUseCase.execute( req );

    } catch (error) {
      responseEnvelope = ApiResponse.error(error, "Error updating doctor");
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
    if (!result) {
      responseEnvelope = ApiResponse.error(CustomError.notFound("Doctor not found"));
      res.status(404).json(responseEnvelope);
      return;
    }
    res.status(200).json(ApiResponse.success(result, "Doctor updated successfully"));

  };
  
  deleteDoctor = async (req: Request, res: Response) => {
    let result;
    let responseEnvelope;
    try {
      result = await deleteDoctorByIdUseCase.execute( req.params );
      if (!result) {
        responseEnvelope = ApiResponse.error(CustomError.notFound(), `Doctor with id ${req.params} not found`)
        res.status(404).json(responseEnvelope);
        return;
      }
      responseEnvelope = ApiResponse.success(null, "Doctor deleted successfully")
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
