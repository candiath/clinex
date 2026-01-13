import { CustomError } from "../../domain/errors/customError";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { Request, Response } from "express";

export function errorHandler (err: unknown, req: Request, res: Response, next: Function) {
  // console.error("Error Handler Middleware:");
  // console.log({err});

  if (err instanceof CustomError) {
    res.status(err.statusCode).json(ApiResponse.error(err));
    return;
  }


  res.status(500).json(ApiResponse.error(err));
}