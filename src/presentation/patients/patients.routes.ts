import { Router } from "express";
import { PatientController } from "./patient.controller";


export class PatientRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new PatientController();


    // router.get('/', ( req, res ) => {
    //   if ( req.query && Object.keys(req.query).length > 0 ) {
    //     console.log('PatientRoutes: query params found', req.query);
    //     controller.getPatientByDni(req, res);
    //   } else {
    //     console.log('PatientRoutes: no query params found, getting all patients');
    //     controller.getPatients(req, res);
    //   }
    // });
    router.get('/', controller.getPatients);
    router.get('/:id', controller.getPatients);
    // router.get('/:dni', controller.getPatients);
    router.post('/', controller.createPatient);
    router.delete('/:dni', controller.deletePatientByDni);
    router.put('/:id', controller.updatePatientByID);

    router.delete('/', (req, res) => {
      res.status(400).json({ "error": "DNI not provided. DELETE method expects dni on the URI"})
    })


    return router;
  }
}