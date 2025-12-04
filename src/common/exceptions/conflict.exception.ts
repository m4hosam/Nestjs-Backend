import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(messageKey: string, details?: any) {
    super(
      {
        messageKey,
        details,
      },
      HttpStatus.CONFLICT,
    );
  }
}
