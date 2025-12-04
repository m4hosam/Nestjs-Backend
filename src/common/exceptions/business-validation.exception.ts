import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessValidationException extends HttpException {
  constructor(messageKey: string, details?: any) {
    super(
      {
        messageKey,
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
