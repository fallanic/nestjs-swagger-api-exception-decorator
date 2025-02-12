import { HttpException, Type } from '@nestjs/common';
import { ExceptionOrExceptionArrayFunc } from '../interfaces/api-exception.interface';
import { Options, Template } from '../interfaces/options.interface';
/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
export declare const buildTemplatedApiExceptionDecorator: <T = Template>(
  template: T | (() => Type<unknown>),
  globalOptions?: Omit<Options<T>, 'template'>,
) => <Exception extends HttpException>(
  exceptions: ExceptionOrExceptionArrayFunc<Exception>,
  options?: Options<T>,
) => ClassDecorator & MethodDecorator;
