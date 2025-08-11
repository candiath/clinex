import { Request, RequestHandler, Response } from "express";
import { CreateAppointmentUseCase } from "../../domain/usecases/appointment/createAppointment.useCase";
import { CustomError } from "../../domain/errors/customError";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { GetAllAppointmentsUseCase } from "../../domain/usecases/appointment/getAllAppointmentsUseCase";
import { GetAppointmentByIdUseCase } from "../../domain/usecases/appointment/getAppointmentByIdUseCase";
import { DeleteAppointmentUseCase } from "../../domain/usecases/appointment/deleteAppointmentUseCase";
import { UpdateAppointmentUseCase } from "../../domain/usecases/appointment/updateAppointmentUseCase";

const repo = null as any;
const createAppointmentUseCase = new CreateAppointmentUseCase(repo);
const getAllAppointmentsUseCase = new GetAllAppointmentsUseCase(repo);
const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(repo);
const deleteAppointmentUseCase = new DeleteAppointmentUseCase(repo);
const updateAppointmentUseCase = new UpdateAppointmentUseCase(repo);
export class AppointmentController {

  create = async (req: Request, res: Response) => {

    let appointment;
    try {
      appointment = await createAppointmentUseCase.execute(req.body);
    } catch (error) {
      const responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
    const responseEnvelope = ApiResponse.success(appointment, 'Appointment created successfully');
    res.status(200).json(responseEnvelope);
  }

  getAll = async (req: Request, res: Response) => {
    let appointments;
    try {
      appointments = await getAllAppointmentsUseCase.execute(req.params);
    } catch (error) {
      const responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
    res.status(200).json(ApiResponse.success(appointments, 'Appointment list retrieved successfuly'));
  }

  getById = async (req: Request, res: Response) => {
    let appointment;
    try {
      appointment = await getAppointmentByIdUseCase.execute(req.params);
    } catch (error) {
      const responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(responseEnvelope);
      } else {
        res.status(500).json(responseEnvelope);
      }
    }
    res.status(200).json(ApiResponse.success(appointment, 'Appointment retrieved successfully'));
  }

  delete = async (req: Request, res: Response) => {
    let result;
    try {
      result = await deleteAppointmentUseCase.execute(req.params);
    } catch (error) {
      
    }
    res.status(200).json('Not implemented');
  }
  update = async (req: Request, res: Response) => {
    let result;
    try {
      result = await updateAppointmentUseCase.execute(req.body)
    } catch (error) {
      const responseEnvelope = ApiResponse.error(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error);
      } else {
        res.status(500).json(error);
      }
    }
    res.status(200).json(ApiResponse.success(result, 'Appointment updated successfully'));
  }
}