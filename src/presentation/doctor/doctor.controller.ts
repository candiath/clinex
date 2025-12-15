import { Request, Response } from "express";
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
const createDoctorUseCase = new CreateDoctorUseCase();
const readDoctorByIdUseCase = new ReadDoctorByIdUseCase(repo);
const readAllDoctorsUseCase = new ReadAllDoctorsUseCase(repo);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase(repo);
const updateDoctorUseCase = new UpdateDoctorUseCase(repo);


export class DoctorController {
  createDoctor = async (req: Request, res: Response) => {
    try {
      const [error, dto] = DoctorDTO.validate(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const result = await createDoctorUseCase.execute(dto!);
      res.status(201).json({ doctor: result });
      return;
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.message);
        return;
      }
      console.error("====> Controller: Error creating doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getDoctorById = async (req: Request, res: Response) => {
    let result;
    let responseEnvelope;
    try {
      const [error, dto] = DoctorDTO.validate(req.params);
      if (error) {
        res.status(400).json({ error })
        return;
      }
      result = await readDoctorByIdUseCase.execute(dto);
    } catch (error) {
      responseEnvelope = ApiResponse.error(error as CustomError, (error as CustomError).message);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
        return;
      } else {
        res.status(500).json(responseEnvelope);
        return;
      }
    }
    responseEnvelope = ApiResponse.success(result, "Doctor fetched successfully");
    res.status(200).json(responseEnvelope);
  }

getAllDoctors = async (req: Request, res: Response) => {
  let responseEnvelope;
  try {
    const doctors = await readAllDoctorsUseCase.execute(null);
    responseEnvelope = ApiResponse.success(doctors, "Doctors retrieved successfully");
    res.status(200).json(responseEnvelope);
    return;
  } catch (error) {
    responseEnvelope = ApiResponse.error(error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(responseEnvelope);
      return;
    } else {
      res.status(500).json(responseEnvelope);
      return;
    }
  }
};

updateDoctor = async (req: Request, res: Response) => {
  let result;
  let responseEnvelope;
  let id: number | undefined;
  try {
    id = DoctorDTO.validateID( req.params.id )
    const [ error, dto ] = DoctorDTO.validate(req.body);
    result = await updateDoctorUseCase.execute(id!, dto!);
  } catch (error) {
    responseEnvelope = ApiResponse.error(error, "Controller: Error updating doctor");
    console.log({error});
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(responseEnvelope);
      return;
    } else {
      res.status(500).json(responseEnvelope);
      return;
    }
  }
  if (!result) {
    responseEnvelope = ApiResponse.error(CustomError.notFound("Doctor not found"));
    res.status(404).json(responseEnvelope);
    return;
  }
  res.status(200).json(ApiResponse.success(result, "Doctor updated successfully"));
  return;
};

deleteDoctor = async (req: Request, res: Response) => {
  let result;
  let responseEnvelope;
  let id: number | undefined;
  
  try {
    id = DoctorDTO.validateID( req.params.id )
    result = await deleteDoctorByIdUseCase.execute(id!);
    if (!result) {
      responseEnvelope = ApiResponse.error(CustomError.notFound(), `Doctor with id ${req.params} not found`)
      res.status(404).json(responseEnvelope);
      return;
    }
    responseEnvelope = ApiResponse.success(null, "Doctor deleted successfully")
    res.status(200).json(responseEnvelope);
    return;

  } catch (error) {
    responseEnvelope = ApiResponse.error(error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(responseEnvelope);
      return;
    } else {
      res.status(500).json(responseEnvelope);
      return;
    }
  }
};
}
