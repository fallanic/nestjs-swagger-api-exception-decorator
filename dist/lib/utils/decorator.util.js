'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.applyClassDecorator = exports.getApiResponseContent = void 0;
const constants_1 = require('@nestjs/swagger/dist/constants');
const api_exception_decorator_1 = require('../decorators/api-exception.decorator');
const getApiResponseContent = descriptor => {
  return Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, descriptor.value);
};
exports.getApiResponseContent = getApiResponseContent;
const applyClassDecorator = (target, exceptions, options) => {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    const metadata = Reflect.getMetadata(constants_1.DECORATORS.API_OPERATION, methodDescriptor.value);
    if (metadata) {
      const decorator = (0, api_exception_decorator_1.ApiException)(exceptions, options);
      decorator(target, key, methodDescriptor);
    }
  }
};
exports.applyClassDecorator = applyClassDecorator;
//# sourceMappingURL=decorator.util.js.map
