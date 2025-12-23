import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

type AnyObj = Record<string, any>;

function isObject(v: unknown): v is AnyObj {
  return typeof v === "object" && v !== null;
}

function getCtorName(err: unknown): string | undefined {
  return isObject(err) ? err?.constructor?.name : undefined;
}

function isPrismaKnownRequestError(
  err: unknown
): err is AnyObj & { code: string } {
  return (
    isObject(err) &&
    getCtorName(err) === "PrismaClientKnownRequestError" &&
    typeof err.code === "string"
  );
}

function isPrismaValidationError(err: unknown): err is AnyObj {
  return isObject(err) && getCtorName(err) === "PrismaClientValidationError";
}

// Sanitize error to prevent exposing sensitive information in production
const sanitizeError = (error: unknown) => {
  if (
    process.env.NODE_ENV === "production" &&
    isObject(error) &&
    typeof error.code === "string" &&
    error.code.startsWith("P")
  ) {
    return { message: "Database operation failed", errorDetails: null };
  }
  return error;
};

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log({ err });

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;

  let message = err instanceof Error ? err.message : "Something went wrong!";
  let error: unknown = err;

  if (isPrismaValidationError(err)) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    error = isObject(err) ? err.message : err;
  } else if (isPrismaKnownRequestError(err)) {
    // Example: unique constraint failed
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate key error";
      error = err.meta ?? { code: err.code };
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Database request error";
      error = { code: err.code, meta: err.meta };
    }
  }

  res.status(statusCode).json({
    success,
    message,
    error: sanitizeError(error),
  });
};

export default globalErrorHandler;
