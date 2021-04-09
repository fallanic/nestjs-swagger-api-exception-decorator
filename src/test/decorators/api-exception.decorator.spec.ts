/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

import { ApiException, buildTemplatedApiExceptionDecorator } from '../../lib';
import { SwaggerAnnotations } from './type/swagger-annotation';

const TemplatedApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  description: '$description',
});

jest.mock('@nestjs/swagger', () => {
  const {
    ApiOperation: ActualApiOperation,
    ApiResponse: ActualApiResponse,
    ...otherImplementations
  } = jest.requireActual('@nestjs/swagger');

  return {
    ...otherImplementations,
    ApiResponse: jest.fn((options: ApiResponseOptions) => ActualApiResponse(options)),
    ApiOperation: (options: ApiOperationOptions) => ActualApiOperation(options),
  };
});

class CustomBadRequestException extends BadRequestException {
  constructor() {
    super('Bad Request');
  }
}

class CustomBadRequestException2 extends BadRequestException {
  constructor() {
    super('Bad Request 2');
  }
}

class CustomNotFoundException extends NotFoundException {
  constructor() {
    super('Not Found');
  }
}

class CustomNotFoundExceptionWithArrayMessage extends NotFoundException {
  constructor(messages: string[]) {
    super(messages.join(', '));
  }
}

describe('Decorator', () => {
  const ApiResponseMock = ApiResponse as jest.Mock<typeof ApiResponse>;

  beforeEach(() => {
    ApiResponseMock.mockClear();
  });

  describe('@ApiException - single exception', () => {
    describe('given valid NestJS built in exception without template or description', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception (forbidden exception) without template or description', () => {
      it('should use the default template including the error property', () => {
        class Ignore {
          @ApiException(ForbiddenException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with description', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException, { description: 'This is a test' })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with description and schema', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException, {
            description: 'This is a test',
            schema: {
              description: 'custom schema',
              type: 'string',
              examples: {
                test: {},
              },
            },
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with type', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException, {
            type: () => SwaggerAnnotations,
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid NestJS built in exception without template but with type and isArray equal true', () => {
      it('should use the default template', () => {
        class Ignore {
          @ApiException(BadRequestException, {
            type: () => SwaggerAnnotations,
            isArray: true,
          })
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });

  describe('@ApiException - multiple exceptions', () => {
    describe('given valid subclassed HttpExceptions', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException([CustomBadRequestException, CustomBadRequestException2])
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given exceptions mismatching http status codes', () => {
      let spy: jest.SpyInstance;

      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it('should build the api-response payload properly but print a warning too', () => {
        class Ignore {
          @TemplatedApiException([CustomBadRequestException, NotFoundException])
          test() {
            return;
          }
        }

        expect(spy).toBeCalled();

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given valid HttpExceptions should be consecutive numbered', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException(NotFoundException)
          @TemplatedApiException(BadRequestException)
          @TemplatedApiException(NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(Ignore.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });

  describe('@TemplatedApiException - single exception', () => {
    describe('given valid subclassed HttpException', () => {
      it('should build the api-response payload properly', () => {
        class Ignore {
          @TemplatedApiException(NotFoundException)
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given a directly instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        class Ignore {
          @TemplatedApiException(new CustomNotFoundExceptionWithArrayMessage(['hallo']))
          test() {
            return;
          }
        }

        expect(ApiResponseMock.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('given a non instantiated exception', () => {
      it('should should use the already instantiated exception', () => {
        try {
          class Ignore {
            @TemplatedApiException(CustomNotFoundExceptionWithArrayMessage)
            test() {
              return;
            }
          }
        } catch (error) {
          expect(error.message.indexOf('Could not instantiate exception')).toBe(0);
        }
      });
    });

    describe('given a template which does not contain an available placeholder', () => {
      const Decorator = buildTemplatedApiExceptionDecorator({ test: 'test' });

      it('should should use the already instantiated exception', () => {
        class Ignore {
          @Decorator(NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(Ignore.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });

    describe('given no template', () => {
      const Decorator = buildTemplatedApiExceptionDecorator(null);

      it('should should use the already instantiated exception', () => {
        class Ignore {
          @Decorator(NotFoundException)
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(Ignore.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });

  describe('usage of multiple @ApiException', () => {
    describe('given multiple @ApiException decorators', () => {
      describe('when method has @ApiOperation attached', () => {
        it('should be grouped correctly', () => {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException([CustomNotFoundException, NotFoundException])
          class GroupTest {
            @ApiOperation({ description: 'test' })
            @TemplatedApiException(new CustomNotFoundExceptionWithArrayMessage(['hallo']))
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toMatchSnapshot();
        });
      });

      describe('when method has @ApiOperation not attached', () => {
        it('should not attach the class exception decorator', () => {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException([CustomNotFoundException, NotFoundException])
          class GroupTest {
            test() {
              return;
            }
          }

          const descriptor = Object.getOwnPropertyDescriptor(GroupTest.prototype, 'test');
          const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

          expect(meta).toBeUndefined();
        });
      });
    });

    describe('when method has the same exception attached multiple times, but with different descriptions', () => {
      it('should group the exceptions properly', () => {
        @TemplatedApiException(CustomBadRequestException, { description: 'One more at class level' })
        class GroupTest1 {
          @TemplatedApiException(CustomBadRequestException)
          @TemplatedApiException(CustomBadRequestException, { description: 'Test' })
          @TemplatedApiException(CustomBadRequestException, { description: 'One more just for testing' })
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest1.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });

    describe('when method has the same exception attached multiple times, but with different instantiated exceptions', () => {
      it('should group the exceptions properly', () => {
        class GroupTest2 {
          @TemplatedApiException([new BadRequestException('test'), new BadRequestException('test 2')])
          @ApiOperation({})
          test() {
            return;
          }
        }

        const descriptor = Object.getOwnPropertyDescriptor(GroupTest2.prototype, 'test');
        const meta = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);

        expect(meta).toMatchSnapshot();
      });
    });
  });
});
