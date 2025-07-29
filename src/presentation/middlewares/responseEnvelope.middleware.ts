import { Request, Response } from "express";
import { ApiResponse } from "../../domain/helpers/apiResponse.helper";
import { CustomError } from "../../domain/errors/customErrors";


export function responseEnvelope(req: Request, res: Response, next: Function) {

  const originalJson = res.json;
  
  res.json = function (data: any) {
    if (data instanceof ApiResponse) {
      console.log("DATA ENVIADA AL ENVELOPE:", data);
      console.log("first call")
      return originalJson.call(this, data)
    }

    if (data instanceof CustomError) {
      console.log("from custom error")
      const errorResponse = ApiResponse.fromCustomError(data);
      return originalJson.call(this, errorResponse);
    }

    if (data instanceof Error) {
      console.log("from error")
      const errorResponse = ApiResponse.error(data, "An error occurred");
      return originalJson.call(this, errorResponse);
    }

    console.log("from success")
    const wrapped = ApiResponse.success(data, "Success");
    return originalJson.call(this, wrapped);
  }

  next();
}