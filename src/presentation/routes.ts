import { Router } from "express";
import { PatientRoutes } from "./patient/patient.routes";
import { DoctorRoutes } from "./doctor/doctor.routes";
import { responseEnvelope } from "./middlewares/responseEnvelope.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";


export class AppRoutes {
  // public static initRoutes(app: express.Application) {
  //   app.use('/api/patients', PatientRoutes);
  // }
  // public static initPublicRoutes(app: express.Application) {
  //   app.use('/public', express.static('public'));
  // }
  // public static initErrorHandling(app: express.Application) {
  //   app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  //     console.error(err.stack);
  //     res.status(500).send('Something broke!');
  //   });
  // }
  // public static initNotFoundHandling(app: express.Application) {
  //   app.use((req: express.Request, res: express.Response) => {
  //     res.status(404).send('Not Found');
  //   });
  // }
  // public static init(app: express.Application) {
  //   this.initRoutes(app);
  //   this.initPublicRoutes(app);
  //   this.initErrorHandling(app);
  //   this.initNotFoundHandling(app);
  // }

  static get routes(): Router {

    const router = Router();

    // Define your routes here
    // Example:
    router.get('/test', (req, res) => {
      res.json('This is a test');
    });

    router.use('/api/patients', PatientRoutes.routes);
    router.use('/api/doctors', DoctorRoutes.routes);
    router.use('/', (req, res) => {
      res.status(404).json({ error: "Resource not Found", url: req.originalUrl });
    });
    router.use(responseEnvelope);
    router.use(errorHandler); // <-- Esto captura errores no manejados
    
    return router;
  }

}