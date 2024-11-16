import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 422;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors
      .map((error) => {
        if (error.type === "field")
          return { message: error.msg, field: error.path };
      })
      .filter((error) => !!error);
  }
}
