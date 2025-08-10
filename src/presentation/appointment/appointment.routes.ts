import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { responseEnvelope } from "../middlewares/responseEnvelope.middleware";

export class AppointmentRoutes {
  static get routes(): Router {

    const router = Router();
    const controller = new AppointmentController();
    
    router.get('/', controller.getAllAppointments);
    router.use(responseEnvelope);

    return router;
  }
}