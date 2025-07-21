import { Router } from "express";
import { DoctorController } from "./doctor.controller";



export class DoctorRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new DoctorController();

    router.get('/:id', controller.getDoctorById);
    router.get('/', controller.getAllDoctors);
    router.post('/', controller.createDoctor);
    router.put('/:id', controller.updateDoctor);
    router.delete('/:id', controller.deleteDoctor);

    return router;
  }
}