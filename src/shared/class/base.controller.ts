import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class BaseController {
  protected sucessResponse(data: any, message = '') {
    return {
      message,
      data,
    };
  }

  protected errorResponse(
    message = 'Sorry, it was not possible to perform this task',
    status = 500,
  ): InternalServerErrorException | BadRequestException {
    return status > 500
      ? new InternalServerErrorException({ message })
      : new BadRequestException({ message });
  }
}
