import { Request, Response } from "express";
import { CreateAppointmentUseCase } from "../../domain/usecases/appointment/createAppointment.useCase";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { GetAllAppointmentsUseCase } from "../../domain/usecases/appointment/getAllAppointmentsUseCase";
import { GetAppointmentByIdUseCase } from "../../domain/usecases/appointment/getAppointmentByIdUseCase";
import { DeleteAppointmentUseCase } from "../../domain/usecases/appointment/deleteAppointmentUseCase";
import { UpdateAppointmentUseCase } from "../../domain/usecases/appointment/updateAppointmentUseCase";
import { AppointmentRepositoryImplementation } from "../../infrastructure/repositories/appointment.repository.implementation";
import { AppointmentMySQLDatasource } from "../../infrastructure/datasources/MySQL/appointment.datasource.implementation";
import { AppointmentDTO } from "../../domain/dtos/appointment/appointment.dto";

const repo = new AppointmentRepositoryImplementation(
  new AppointmentMySQLDatasource()
);
const createAppointmentUseCase = new CreateAppointmentUseCase(repo);
const getAllAppointmentsUseCase = new GetAllAppointmentsUseCase(repo);
const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(repo);
const deleteAppointmentUseCase = new DeleteAppointmentUseCase(repo);
const updateAppointmentUseCase = new UpdateAppointmentUseCase(repo);

export class AppointmentController {
  
  create = async (req: Request, res: Response) => {
    const [ , dto ] = AppointmentDTO.validate(req.body);
    const appointment = await createAppointmentUseCase.execute(dto);
    const responseEnvelope = ApiResponse.success(
      appointment,
      "Appointment created successfully"
    );
    res.status(200).json(responseEnvelope);
    return;
  };

  getAll = async (req: Request, res: Response) => {
    const appointments = await getAllAppointmentsUseCase.execute();
    res
      .status(200)
      .json(
        ApiResponse.success(
          appointments,
          "Appointment list retrieved successfuly"
        )
      );
    return;
  };

  getById = async (req: Request, res: Response) => {
    const [ , IDdto ] = AppointmentDTO.validateID( req.params );
    const appointment = await getAppointmentByIdUseCase.execute(req.params.id);
    res
      .status(200)
      .json(
        ApiResponse.success(appointment, "Appointment retrieved successfully")
      );
    return;
  };

  delete = async (req: Request, res: Response) => {
    const result = await deleteAppointmentUseCase.execute(req.params.id);
    res
      .status(200)
      .json(ApiResponse.success(result, "Appointment deleted successfully"));
    return;
  };
  update = async (req: Request, res: Response) => {
    const result = await updateAppointmentUseCase.execute(req.body);
    res
      .status(200)
      .json(ApiResponse.success(result, "Appointment updated successfully"));
    return;
  };
}
