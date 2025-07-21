import { Request, Response } from "express";
import { DoctorDTO } from "../../domain/dtos/doctor/doctor.dto";
import { CreateDoctorUseCase } from "../../domain/usecases/doctor/createDoctor.useCase";
import { DoctorRepositoryImplementation } from "../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorMySQLDatasource } from "../../infrastructure/datasources/MySQL/doctor.datasource.implementation";
import { ReadDoctorByIdUseCase } from "../../domain/usecases/doctor/read-doctor-by-id.use-case";
import { CustomError } from "../../domain/errors/customErrors";
import { ReadAllDoctorsUseCase } from "../../domain/usecases/doctor/readAllDoctors.useCase";

const repo = new DoctorRepositoryImplementation(new DoctorMySQLDatasource());
const createDoctorUseCase = new CreateDoctorUseCase(repo);
const readDoctorByIdUseCase = new ReadDoctorByIdUseCase( repo );
const readAllDoctorsUseCase = new ReadAllDoctorsUseCase( repo );

export class DoctorController {
  createDoctor = async (req: Request, res: Response) => {
    try {
      const [error, dto] = DoctorDTO.validate(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }

      const result = await createDoctorUseCase.execute(dto);
      console.log(result);
      res.status(201).json({ doctor: result });
    } catch (error) {
      console.error("====> Controller: Error creating doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getDoctorById = async (req: Request, res: Response) => {
    try {
      const [ error, dto ] = DoctorDTO.validate( req.params );
      if ( error ) {
        res.status(400).json(error);
        return;
      }
      const result = await readDoctorByIdUseCase.execute( dto );
      res.status(200).json(result);
    } catch ( error ) {
      if ( error instanceof CustomError ) {
        // todo: revisar error: error.message
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error("====> Controller: Error fetching doctor by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error });
      }
    }
  }

  getAllDoctors = async (req: Request, res: Response) => {
    try {
      const doctors = await readAllDoctorsUseCase.execute( req ); 
      res.status(200).json(doctors);
    } catch (error) {
      console.error("Controller: Error fetching doctors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateDoctor = async (req: Request, res: Response) => {
    try {
      const [error, dto] = DoctorDTO.validate(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }

      const result = await repo.update(req.params.id, dto!);
      if (!result) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }
      res.status(200).json({ success: true, doctor: result });
    } catch (error) {
      console.error("Controller: Error updating doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteDoctor = async (req: Request, res: Response) => {
    try {
      const result = await repo.delete(req.params.id);
      if (!result) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Controller: Error deleting doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
