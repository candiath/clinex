import { CustomError, CustomErrorOptions } from "./customError";

describe("CustomError", () => {
  const VALID_BADREQUEST_DATA: CustomErrorOptions = {
    code: "400",
    details: {
      message: "Invalid request",
      field: "email",
    },
    timestamp: new Date("2025-08-05T12:34:56.789Z"),
    context: {
      userId: "12345",
      requestId: "abcde",
    },
    userFriendlyMessage: "Please check your input and try again.",
  };

  describe("Successful instantiation", () => {
    it("Should return valid badRequest data successfully", () => {
      const error = CustomError.badRequest(
        "Invalid request",
        VALID_BADREQUEST_DATA
      );
      expect(error).toBeInstanceOf(CustomError);
      expect(error.code).toBe("400");
      expect(error.details).toEqual({
        message: "Invalid request",
        field: "email",
      });
      expect(error.timestamp).toEqual(new Date("2025-08-05T12:34:56.789Z"));
      expect(error.context).toEqual({
        userId: "12345",
        requestId: "abcde",
      });
      expect(error.userFriendlyMessage).toBe(
        "Please check your input and try again."
      );
    });

    it("Should return valid badRequest data with default data", () => {
      const error = CustomError.badRequest();
      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(400);
      expect(error.details).toBeUndefined();
      expect(error.timestamp).toBeDefined();
      expect(error.context).toBeUndefined();
      expect(error.userFriendlyMessage).toBe(undefined);
    });
  });
  // From error
  describe("fromError", () => {
    it("Should convert a standard Error to CustomError", () => {
      
      const standardError = new Error("Standard error message");
      const customError = CustomError.fromError(standardError);

      expect(customError).toBeInstanceOf(CustomError);
      expect(customError.message).toBe("Standard error message");
      expect(customError.statusCode).toBe(500);
      expect(customError.code).toBe("UNHANDLED_ERROR");
      expect(customError.details).toBeUndefined();
      expect(customError.timestamp).toBeUndefined();
      expect(customError.context).toBeUndefined();
      expect(customError.userFriendlyMessage).toBeUndefined();
    });

    test.todo("Should convert a CustomError to CustomError without losing properties");
    test.todo("Should handle CustomError with additional properties correctly");
    test.todo("Should handle CustomError with wrong additional properties correctly");
  });
});
