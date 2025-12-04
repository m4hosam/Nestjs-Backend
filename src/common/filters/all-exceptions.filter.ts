import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  error: string;
  messageKey: string;
  details?: any;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageKey = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'messageKey' in exceptionResponse
      ) {
        messageKey = (exceptionResponse as any).messageKey;
        details = (exceptionResponse as any).details;
      } else if (typeof exceptionResponse === 'string') {
        messageKey = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        // Handle class-validator errors
        const messages = (exceptionResponse as any).message;
        if (Array.isArray(messages) && messages.length > 0) {
          messageKey = messages[0]; // Use first validation error as key
          details = { validationErrors: messages };
        } else {
          messageKey = (exceptionResponse as any).message;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      messageKey = 'INTERNAL_SERVER_ERROR';
      details =
        process.env.NODE_ENV === 'development'
          ? {
              message: exception.message,
              stack: exception.stack,
            }
          : undefined;
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      error: HttpStatus[statusCode] || 'Internal Server Error',
      messageKey,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${statusCode} - MessageKey: ${messageKey}`,
    );

    response.status(statusCode).json(errorResponse);
  }
}
