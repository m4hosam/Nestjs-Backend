import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(messageKey: string, details?: any) {
    super(
      {
        messageKey,
        details,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
