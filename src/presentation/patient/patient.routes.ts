import { Router } from "express";
import { PatientController } from "./patient.controller";
import { responseEnvelope } from "../middlewares/responseEnvelope.middleware";

export class PatientRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new PatientController();

    router.use(responseEnvelope); // Middleware to wrap responses

    router.get('/:id', controller.getPatientById);
    router.get('/', controller.getAllPatients);
    router.post('/', controller.createPatient);
    router.put('/:id', controller.updatePatient);
    router.delete('/:id', controller.deletePatient);

    return router;
  }
}