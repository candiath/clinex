import { Request, RequestHandler, Response } from "express";
import { CreateAppointmentUseCase } from "../../domain/usecases/appointment/createAppointment.usecase";
import { CustomError } from "../../domain/errors/customError";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";

const repo = null as any;
const createAppointmentUseCase = new CreateAppointmentUseCase(repo)

export class AppointmentController {
 /**
  * express
  * controller
  * usecase  => dto => DB
  */
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
    res.status(200).json({success: true, message: 'no appointments'})
  }

  getById = async (req: Request, res: Response) => {
    res.status(409).json('Not implemented');
  }
  delete = async (req: Request, res: Response) => {
    res.status(409).json('Not implemented');
  }
  update = async (req: Request, res: Response) => {
    res.status(409).json('Not implemented');
  }
}