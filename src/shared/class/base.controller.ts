import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

type ErrorResponse = {
  response: { statusCode: number; message: string };
  status: number;
  message: string;
};

export class BaseController {
  protected sucessResponse(data: any, message = '') {
    return {
      message,
      data,
    };
  }

  protected errorResponse(
    err: ErrorResponse,
  ): InternalServerErrorException | ErrorResponse {
    return err.message === 'Internal Server Error'
      ? new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        )
      : err;
  }
}
