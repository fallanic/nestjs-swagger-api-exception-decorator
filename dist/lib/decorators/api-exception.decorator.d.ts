import { HttpException } from '@nestjs/common';
import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
import { Options } from '../interfaces/options.interface';
/**
 * This shows exceptions with status code, description and grouped with example values. If there are multiple exceptions
 * per status codes, all matching exceptions will be grouped and shown as examples.
 *
 * When using as class decorator, the exceptions will be attached to all methods which have a @ApiOperation decorator.
 *
 * @param exceptions Pass one or more exceptions with a arrow function which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
export declare function ApiException<T extends HttpException>(
  exceptions: ExceptionOrExceptionArrayFunc<T>,
  options?: Options,
): ClassDecorator & MethodDecorator;
