import { Request, Response } from "express";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { DoctorRepositoryImplementation } from "../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorMySQLDatasource } from "../../infrastructure/datasources/MySQL/doctor.datasource.implementation";
import { CreateDoctorUseCase } from "../../domain/usecases/doctor/createDoctor.useCase";
import { ReadDoctorByIdUseCase } from "../../domain/usecases/doctor/readDoctorById.useCase";
import { ReadAllDoctorsUseCase } from "../../domain/usecases/doctor/readAllDoctors.useCase";
import { DeleteDoctorByIdUseCase } from "../../domain/usecases/doctor/deleteDoctorById.useCase";
import { UpdateDoctorUseCase } from "../../domain/usecases/doctor/updateDoctor.useCase";
import { validate, validateID } from "../../domain/dtos/doctor/doctor.dto";
import { DoctorInterface } from "../../domain/interfaces/doctor.interfaces";

const repo = new DoctorRepositoryImplementation(new DoctorMySQLDatasource());
const createDoctorUseCase = new CreateDoctorUseCase(repo);
const readDoctorByIdUseCase = new ReadDoctorByIdUseCase(repo);
const readAllDoctorsUseCase = new ReadAllDoctorsUseCase(repo);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase(repo);
const updateDoctorUseCase = new UpdateDoctorUseCase(repo);

export class DoctorController {
  createDoctor = async (req: Request, res: Response) => {
    const dto: DoctorInterface = validate(req.body);
    const result = await createDoctorUseCase.execute(dto!);
    res.status(201).json({ doctor: result });
    return;
  };

  getDoctorById = async (req: Request, res: Response) => {
    // const [, dto] = validate(req.params);
    const id = validateID(req.params.id)
    const result = await readDoctorByIdUseCase.execute(id!);
    const responseEnvelope = ApiResponse.success(result, "Doctor fetched successfully");
    res.status(200).json(responseEnvelope);
  }

  getAllDoctors = async (req: Request, res: Response) => {
    const doctors = await readAllDoctorsUseCase.execute();
    const responseEnvelope = ApiResponse.success(doctors, "Doctors retrieved successfully");
    res.status(200).json(responseEnvelope);
    return;
  };

  updateDoctor = async (req: Request, res: Response) => {
    const id = validateID(req.params.id)
    const dto: DoctorInterface = validate(req.body);
    const result = await updateDoctorUseCase.execute(id!, dto!);
    res.status(200).json(ApiResponse.success(result, "Doctor updated successfully"));
    return;
  };

  deleteDoctor = async (req: Request, res: Response) => {
    const id = validateID(req.params.id)
    const result = await deleteDoctorByIdUseCase.execute(id!);
    const responseEnvelope = ApiResponse.success(result, "Doctor deleted successfully")
    res.status(200).json(responseEnvelope);
    return;
  };
}
