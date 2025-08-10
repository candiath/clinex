import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { responseEnvelope } from "../middlewares/responseEnvelope.middleware";

export class AppointmentRoutes {
  static get routes(): Router {

    const router = Router();
    const controller = new AppointmentController();
    
    router.use(responseEnvelope);
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/', controller.getAll);

    return router;
  }
}