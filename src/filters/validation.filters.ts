import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import responseObject from 'src/helpers/response-object';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const validationErrors = exceptionResponse.message;

    if (Array.isArray(validationErrors)) {
      response.status(status).json(
        responseObject({
          message: validationErrors[0],
        }),
      );
    } else {
      response.status(status).json(exceptionResponse);
    }
  }
}
