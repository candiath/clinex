import { Router } from "express";
import { PatientController } from "./patient.controller";


export class PatientRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new PatientController();

    
    router.get('/', controller.getPatients);
    router.post('/', controller.createPatient);


    return router;
  }
}