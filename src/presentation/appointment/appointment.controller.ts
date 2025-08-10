import { Request, RequestHandler, Response } from "express";


export class AppointmentController {
 
  create = async (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'appointment created'})
  }

  getAllAppointments = async (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'no appointments'})
  }
}