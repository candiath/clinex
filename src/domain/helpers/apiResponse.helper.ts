import { CustomError } from "../errors/customErrors";

// export interface ApiError {
//   code: string;
//   message: string;
//   details?: string;
// }

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponseOptions {
  message?: string;
  error?: any;
  pagination?: PaginationMeta;
  // meta?: Record<string, any>;
}

export class ApiResponse<T = any> {
  success: boolean;
  data?: T | null;
  message?: string | null;
  error?: any | null;
  pagination?: PaginationMeta | null;
  timestamp: string;
  // meta?: Record<string, any>;

  constructor(options: ApiResponseOptions & {success: boolean, data?: T}){
    this.success = options.success ?? true;
    this.data = options.data ?? null;
    this.message = options.message ?? null;
    this.error = options.error ?? null;
    this.pagination = options.pagination ?? null;
    this.timestamp = new Date().toString();
    // this.meta = options.meta;
  }

  static searchResult<T>(data:T[], pagination?: PaginationMeta, message?: string): ApiResponse<T[]> {
    return new ApiResponse<T[]>({
      success: true,
      data,
      pagination,
      message: message || 'Search completed successfully',
    });
  }

  static success<T>(data: T, message: string): ApiResponse<T> {
    return new ApiResponse<T>({ 
      success: true,
      data: data,
      message: message,
    })
  }

  static error<T>(error: any, message?: string): ApiResponse<T> {
    return new ApiResponse({
      success: false,
      message: message ?? "Something went wrong",
      error: {
        code: error.code ?? "UNKNOWN_ERROR",
        statusCode: error.statusCode ?? 500,
        message: error.message ?? "An unexpected error occurred",
      }
    })
  }

  static fromCustomError<T>(error: CustomError): ApiResponse<T> {
    return new ApiResponse(
      {
        success: false,
        message: 'Oh rayos',
        error: {
          code: error.name || "UNKNOWN_ERROR",
          statusCode: error.statusCode,
          message: error.message,
          timestamp: new Date().toString(),
        },
      });
  }
}