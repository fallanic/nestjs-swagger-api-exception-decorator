import { HttpException } from '@nestjs/common';
import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
import { MetaContent } from '../interfaces/api-response.interface';
import { Options } from '../interfaces/options.interface';
export declare const getApiResponseContent: (descriptor?: PropertyDescriptor) => Record<string, MetaContent>;
export declare const applyClassDecorator: <T extends HttpException>(
  target: () => void,
  exceptions: ExceptionOrExceptionArrayFunc<T>,
  options?: Options,
) => void;
