import { HttpException } from '@nestjs/common';
import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
export declare const instantiateExceptions: (
  exceptions: ExceptionOrExceptionArrayFunc<HttpException>,
) => HttpException[];
