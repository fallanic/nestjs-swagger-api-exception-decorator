'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildPlaceholder = exports.buildTemplatedApiExceptionDecorator = exports.ApiException = void 0;
var api_exception_decorator_1 = require('./decorators/api-exception.decorator');
Object.defineProperty(exports, 'ApiException', {
  enumerable: true,
  get: function () {
    return api_exception_decorator_1.ApiException;
  },
});
var templated_decorator_builder_1 = require('./builder/templated-decorator.builder');
Object.defineProperty(exports, 'buildTemplatedApiExceptionDecorator', {
  enumerable: true,
  get: function () {
    return templated_decorator_builder_1.buildTemplatedApiExceptionDecorator;
  },
});
var placeholder_builder_1 = require('./builder/placeholder.builder');
Object.defineProperty(exports, 'buildPlaceholder', {
  enumerable: true,
  get: function () {
    return placeholder_builder_1.buildPlaceholder;
  },
});
//# sourceMappingURL=index.js.map
