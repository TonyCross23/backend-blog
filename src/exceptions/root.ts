export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  NOT_FOUND = 404,
  ALREADY_EXISTS = 409,
  UNAUTHORIZED = 401,
  VALIDATION = 422,
  INTERNAL_EXCEPTION = 500,
  BAD_REQUEST = 400,
}
