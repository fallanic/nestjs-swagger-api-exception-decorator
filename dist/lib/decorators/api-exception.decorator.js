'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiException = void 0;
const swagger_1 = require('@nestjs/swagger');
const decorator_util_1 = require('../utils/decorator.util');
const example_content_util_1 = require('../utils/example-content.util');
const exception_util_1 = require('../utils/exception.util');
const options_util_1 = require('../utils/options.util');
const type_util_1 = require('../utils/type.util');
/**
 * This shows exceptions with status code, description and grouped with example values. If there are multiple exceptions
 * per status codes, all matching exceptions will be grouped and shown as examples.
 *
 * When using as class decorator, the exceptions will be attached to all methods which have a @ApiOperation decorator.
 *
 * @param exceptions Pass one or more exceptions with a arrow function which should be shown in Swagger API documentation
 * @param options Set a template or specify the content type
 */
function ApiException(exceptions, options) {
  (0, type_util_1.resolveTypeTemplate)(options);
  const mergedOptions = (0, options_util_1.mergeOptions)(options);
  const instances = (0, exception_util_1.instantiateExceptions)(exceptions);
  const newContents = (0, example_content_util_1.buildContentObjects)(instances, mergedOptions);
  return (target, propertyKey, descriptor) => {
    if (descriptor) {
      const content = (0, decorator_util_1.getApiResponseContent)(descriptor);
      for (const [statusCode, newContent] of Object.entries(newContents)) {
        if (content === null || content === void 0 ? void 0 : content[statusCode]) {
          const existingContent = content[statusCode].content;
          (0, example_content_util_1.mergeExampleContent)(existingContent, newContent);
        } else {
          (0, swagger_1.ApiResponse)({ status: parseInt(statusCode), content: newContents[statusCode] })(
            target,
            propertyKey,
            descriptor,
          );
        }
      }
    } else {
      (0, decorator_util_1.applyClassDecorator)(target, exceptions, options);
    }
    return descriptor ? descriptor : target;
  };
}
exports.ApiException = ApiException;
//# sourceMappingURL=api-exception.decorator.js.map
