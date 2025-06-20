import { Router } from "express";
import { PatientController } from "./patient.controller";


export class PatientRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new PatientController();


    router.get('/', controller.getPatients);
    router.get('/:dni', controller.getPatientByDni);
    router.post('/', controller.createPatient);
    router.delete('/:dni', controller.deletePatientByDni);
    router.put('/:id', controller.updatePatientByID);

    router.delete('/', (req, res) => {
      res.status(400).json({ "error": "DNI not provided. DELETE method expects dni on the URI"})
    })


    return router;
  }
}