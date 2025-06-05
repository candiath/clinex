import { Request, Response } from "express";

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   res.status(200).json({"message": "Hello World!"});
// })


// export const PatientRouter = router;

export class PatientController {

  constructor(){}

  createPatient = async (req: Request, res: Response) => {
    res.json({"source": "createPatients", "timestamp": new Date(),});
  }

  getPatients = async (req: Request, res: Response) => {
    res.json({"source": "getPatients", "timestamp": new Date(),});
  }
}