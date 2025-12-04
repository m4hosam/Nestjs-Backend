import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(messageKey: string = 'INSUFFICIENT_PERMISSIONS', details?: any) {
    super(
      {
        messageKey,
        details,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
