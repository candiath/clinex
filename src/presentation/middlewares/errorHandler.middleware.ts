import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { Request, Response } from "express";

export function errorHandler (err: any, req: Request, res: Response, next: Function) {
  console.error("Error Handler Middleware:", err);

  const statusCode = err.statusCode || 500;
  const errorResponse = ApiResponse.error(err, "Unhandled error occurred");

  res.status(statusCode).json(errorResponse);
}