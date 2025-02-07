'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildPlaceholder = void 0;
/**
 * Build your own custom placeholder by passing a custom exception and a resolver function
 *
 * @param exception () => ? extends HttpException
 * @param resolver: (exception: ? extends HttpException) => exception.yourCustomFunction();
 */
const buildPlaceholder = (exception, resolver) => {
  return {
    exceptionMatcher: exception,
    resolver,
  };
};
exports.buildPlaceholder = buildPlaceholder;
//# sourceMappingURL=placeholder.builder.js.map
