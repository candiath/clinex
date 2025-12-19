export interface CustomErrorOptions {
  code?: string;
  details?: any;
  timestamp?: Date;
  context?: any;
  userFriendlyMessage?: string;
  location?: string;
}

export class CustomError extends Error {
  public readonly code?: string;
  public readonly details?: string;
  public readonly timestamp?: Date;
  public readonly context?: string;
  public readonly userFriendlyMessage?: string;
  public readonly location?: string;

  private constructor(
    public readonly statusCode: number = 500,
    public readonly message: string,
    options?: CustomErrorOptions
  ) {
    super(message);
    this.name = "CustomError";
    this.code = options?.code ?? undefined;
    this.details = options?.details ?? undefined;
    this.timestamp = options?.timestamp ?? undefined;
    this.context = options?.context ?? undefined;
    this.userFriendlyMessage = options?.userFriendlyMessage ?? undefined;
    this.location = options?.location ?? undefined;

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  static badRequest(
    message?: string,
    options?: CustomErrorOptions
  ): CustomError {
    // 400: The server cannot process the request due to client error (e.g., malformed request syntax).
    return new CustomError(400, (message = message || "Bad Request"), {
      code: "BAD_REQUEST",
      timestamp: new Date(),
      ...options,
    });
  }
  // static unauthorized(message?: string): CustomError {
  //   // 401: Authentication is required and has failed or has not yet been provided.
  //   return new CustomError(401, (message = message || "Unauthorized"));
  // }
  // static paymentRequired(message?: string): CustomError {
  //   // 402: Reserved for future use; sometimes used for payment-related errors.
  //   return new CustomError(402, message || "Payment Required");
  // }
  // static forbidden(message?: string): CustomError {
  //   // 403: The client does not have access rights to the content.
  //   return new CustomError(403, (message = message || "Forbidkden"));
  // }
  static notFound(message?: string, options?: CustomErrorOptions): CustomError {
    // 404: The server can not find the requested resource.
    return new CustomError(404, (message = message || "Not Found"), {
      code: "NOT_FOUND",
      timestamp: new Date(),
      ...options,
    });
  }
  // static requestTimeout(message?: string): CustomError {
  //   // 408: The server timed out waiting for the request.
  //   return new CustomError(408, message || "Request Timeout");
  // }
  static conflict(message?: string): CustomError {
    // 409: The request could not be completed due to a conflict with the current state of the resource.
    return new CustomError(409, message || "Conflict");
  }
  // static gone(message?: string): CustomError {
  //   // 410: The resource requested is no longer available and will not be available again.
  //   return new CustomError(410, message || "Gone");
  // }
  // static lengthRequired(message?: string): CustomError {
  //   // 411: The server refuses to accept the request without a defined Content-Length header.
  //   return new CustomError(411, message || "Length Required");
  // }
  // static preconditionFailed(message?: string): CustomError {
  //   // 412: The server does not meet one of the preconditions that the requester put on the request.
  //   return new CustomError(412, message || "Precondition Failed");
  // }
  // static payloadTooLarge(message?: string): CustomError {
  //   // 413: The request is larger than the server is willing or able to process.
  //   return new CustomError(413, message || "Payload Too Large");
  // }
  // static uriTooLong(message?: string): CustomError {
  //   // 414: The URI provided was too long for the server to process.
  //   return new CustomError(414, message || "URI Too Long");
  // }
  // static unsupportedMediaType(message?: string): CustomError {
  //   // 415: The request entity has a media type which the server or resource does not support.
  //   return new CustomError(415, message || "Unsupported Media Type");
  // }
  // static expectationFailed(message?: string): CustomError {
  //   // 417: The server cannot meet the requirements of the Expect request-header field.
  //   return new CustomError(417, message || "Expectation Failed");
  // }
  // static locked(message?: string): CustomError {
  //   // 423: The resource that is being accessed is locked.
  //   return new CustomError(423, message || "Locked");
  // }
  // static failedDependency(message?: string): CustomError {
  //   // 424: The request failed due to failure of a previous request (e.g., a PROPPATCH).
  //   return new CustomError(424, message || "Failed Dependency");
  // }
  // static upgradeRequired(message?: string): CustomError {
  //   // 426: The client should switch to a different protocol.
  //   return new CustomError(426, message || "Upgrade Required");
  // }
  // static preconditionRequired(message?: string): CustomError {
  //   // 428: The origin server requires the request to be conditional.
  //   return new CustomError(428, message || "Precondition Required");
  // }
  // static tooManyRequests(message?: string): CustomError {
  //   // 429: The user has sent too many requests in a given amount of time (rate limiting).
  //   return new CustomError(429, message || "Too Many Requests");
  // }
  // static unavailableForLegalReasons(message?: string): CustomError {
  //   // 451: The server is denying access to the resource as a consequence of a legal demand.
  //   return new CustomError(451, message || "Unavailable For Legal Reasons");
  // }
  static internalServerError(
    message?: string,
    options?: CustomErrorOptions
  ): CustomError {
    // 500: A generic error message, given when no more specific message is suitable.
    return new CustomError(500, message || "Internal Server Error", { ...options, code: "INTERNAL_SERVER_ERROR" });
  }
  static notImplemented(
    message?: string,
    options?: CustomErrorOptions
  ): CustomError {
    // 501: The server either does not recognize the request method, or it lacks the ability to fulfill the request.
    return new CustomError(501, message || "Not Implemented", { ...options, code: "NOT_IMPLEMENTED" });
  }
  // static badGateway(message?: string): CustomError {
  //   // 502: The server was acting as a gateway or proxy and received an invalid response from the upstream server.
  //   return new CustomError(502, message || "Bad Gateway");
  // }
  static serviceUnavailable(message?: string): CustomError {
    // 503: The server is currently unavailable (because it is overloaded or down for maintenance).
    return new CustomError(503, message || "Service Unavailable");
  }
  // static gatewayTimeout(message?: string): CustomError {
  //   // 504: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
  //   return new CustomError(504, message || "Gateway Timeout");
  // }

  static fromError(error: Error, options?: CustomErrorOptions): CustomError {
    if (error instanceof CustomError) {
      return error; // If it's already a CustomError, return it as is
    }
    // Otherwise, create a new CustomError with a generic message and status code 500
    return new CustomError(
      500,
      error.message || "An unexpected error occurred",
      { ...options, code: "UNHANDLED_ERROR" }
    );
  }
}
