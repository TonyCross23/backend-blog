import { HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
  constructor(message: string, errorCode: any, error: any) {
    super(message, errorCode, 422, error);
  }
}
